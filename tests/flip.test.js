const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

function setup({ page, blob = {}, getDocument, sourceURL = 'example.pdf' } = {}) {
  const revoked = []
  const requests = []
  let nextURL = 0
  const jquery = () => ({ attr() { return this }, on() { return this } })
  jquery.fn = { extend() {} }
  jquery.ajax = options => requests.push(options)
  const pdfjsLib = { GlobalWorkerOptions: {}, getDocument: getDocument || (() => ({ promise: new Promise(() => {}) })) }
  const window = { devicePixelRatio: 1, location: { hostname: 'example.test', href: 'https://example.test/' }, pdfjsLib, getComputedStyle: () => ['-webkit-'] }
  const document = {
    body: { style: {} },
    createElement(tag) {
      if (tag === 'a') return { set href(value) { this.hostname = new URL(value, 'https://example.test').hostname } }
      if (tag === 'canvas') return { getContext() { return {} }, toBlob(callback) { callback(blob) } }
      throw new Error(`Unexpected element: ${tag}`)
    }
  }
  const context = { window, document, navigator: { userAgent: 'Node test' }, jQuery: jquery, pdfjsLib,
    URL: { revokeObjectURL: url => revoked.push(url) }, performance: { now: () => 0 },
    console, setTimeout, clearTimeout, atob, PDFLinkService: function () { this.setDocument = () => {} } }
  let source = fs.readFileSync('lib/js/flip.js', 'utf8')
  source = source.slice(0, source.indexOf('})(FLIP, jQuery);') + '})(FLIP, jQuery);'.length)
  source = source.replace('})(FLIP, jQuery);', '  t.__test = { TextureLibrary: Y, FlipBook: Q };\n})(FLIP, jQuery);')
  vm.runInNewContext(source, context)
  const flip = context.FLIP
  flip.createObjectURL = () => `blob:test-${++nextURL}`
  const messages = []
  const provider = new flip.__test.TextureLibrary(sourceURL, null,
    { text: { loading: 'Loading' }, pageSize: flip.PAGE_SIZE.SINGLE, forceFit: true, canvasToBlob: true },
    { updateInfo: message => messages.push(message) })
  provider.pageCount = 3
  provider.contentSourceType = flip.SOURCE_TYPE.PDF
  provider.contentSource = { getPage: page || (() => Promise.reject(new Error('page unavailable'))) }
  provider.targetObject = { mode: 'webgl' }
  provider.cache[provider.cacheIndex] = []
  provider.cache[provider.thumbsize] = []
  const output = []
  provider.setPage = (...args) => output.push(args)
  provider.setLoading = () => {}
  return { flip, provider, output, revoked, requests, messages }
}

test('viewer controls expose accessible labels and keyboard-operable thumbnails', () => {
  const source = fs.readFileSync('lib/js/flip.js', 'utf8')
  const css = fs.readFileSync('lib/css/main.css', 'utf8')
  assert.match(source, /aria-label="Go to page"/)
  assert.match(source, /createElement\("button"\);\s*var i = e \+ 1;\s*t\.type = "button";\s*t\.setAttribute\("aria-label", "Go to page " \+ i\)/)
  assert.match(source, /<button type="button" aria-label="Close thumbnails"/)
  assert.match(source, /"aria-controls": menuId/)
  assert.match(source, /E\.toggleClass\("df-active", open\)\.attr\("aria-expanded", String\(open\)\)/)
  assert.match(source, /if \(E\.hasClass\("df-active"\)\) \{\s*I\(\);\s*E\.trigger\("focus"\)/)
  assert.ok(source.includes(`c.pageLabel = i('<label/>').attr("for", pageInputId)`))
  assert.match(css, /\.df-ui-page input:focus\+label/)
})

const flush = () => new Promise(resolve => setImmediate(resolve))
const makePage = render => ({ getViewport: () => ({ width: 100, height: 200 }), render })

test('PDF error messages are passed as text, not HTML', () => {
  const { flip } = setup()
  const calls = []
  const info = { text: value => calls.push(['text', value]), html: value => calls.push(['html', value]) }
  const message = 'Cannot access file! <img src=x onerror=alert(1)>'
  flip.__test.FlipBook.prototype.updateInfo.call({ container: { info } }, message)
  assert.deepEqual(calls, [['text', message]])
})

test('page boundaries reject invalid pages and allow first and last', async () => {
  const fetched = []
  const { provider, output } = setup({ page: number => { fetched.push(number); return Promise.reject(new Error('offline')) } })
  for (const number of [0, -1, 4, 'invalid']) provider.getPage(number)
  assert.equal(output.length, 4)
  assert.ok(output.every(call => call[1] === 'blank'))
  assert.ok(Number.isNaN(output[3][0]))
  assert.deepEqual(fetched, [])
  provider.getPage(1)
  provider.getPage(3)
  await flush()
  assert.deepEqual(fetched, [1, 3])
  assert.deepEqual(output.slice(4).map(call => call.slice(0, 2)), [[1, 'blank'], [3, 'blank']])
})

test('PDF page and render failures and null blobs use fallback', async () => {
  for (const options of [
    { page: () => Promise.reject(new Error('page failed')) },
    { page: () => Promise.resolve(makePage(() => ({ promise: Promise.reject(new Error('render failed')) }))) },
    { page: () => Promise.resolve(makePage(() => ({ promise: Promise.resolve() }))), blob: null }
  ]) {
    const { provider, output } = setup(options)
    const callback = () => {}
    provider.getPage(2, callback, true)
    await flush()
    assert.equal(output.length, 1)
    assert.deepEqual(output[0], [2, 'blank', callback, true])
  }
})

test('base64 access and decoding failures report safe error messages', () => {
  const access = setup({ sourceURL: 'example.base64' })
  assert.equal(access.requests.length, 1)
  access.requests[0].error()
  assert.equal(access.messages.at(-1), 'Cannot access PDF data.')

  const decode = setup({ sourceURL: 'example.base64' })
  decode.requests[0].success('not valid base64!')
  assert.equal(decode.messages.at(-1), 'Cannot decode PDF data.')
})

test('late PDF page completion after disposal does not render or set fallback', async () => {
  let resolvePage
  const { provider, output } = setup({ page: () => new Promise(resolve => { resolvePage = resolve }) })
  provider.getPage(1)
  provider.dispose()
  resolvePage(makePage(() => { throw new Error('must not render') }))
  await flush()
  assert.deepEqual(output, [])
})

test('rendered blob URLs are revoked on cache replacement and disposal', async () => {
  const { provider, output, revoked } = setup({ page: () => Promise.resolve(makePage(() => ({ promise: Promise.resolve() }))) })
  provider.getPage(1)
  await flush()
  assert.equal(output[0][1], 'blob:test-1')
  provider.setCache(1, 'blob:test-1', false)
  assert.deepEqual(revoked, [])
  provider.getPage(2)
  await flush()
  provider.setCache(1, 'replacement', false)
  assert.deepEqual(revoked, ['blob:test-1'])
  provider.dispose()
  assert.deepEqual(revoked, ['blob:test-1', 'blob:test-2'])
})
