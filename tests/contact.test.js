const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

function setup(withEmail = false) {
  const documentHandlers = {}
  function element() {
    const handlers = {}
    const classes = new Set()
    return {
      handlers, hidden: false, style: {}, attributes: {},
      classList: {
        toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name) },
        remove(name) { classes.delete(name) },
        contains(name) { return classes.has(name) }
      },
      addEventListener(name, handler) { handlers[name] = handler },
      setAttribute(name, value) { this.attributes[name] = value },
      getAttribute(name) { return this.attributes[name] },
      getAnimations() { return [] },
      contains(target) { return target === this },
      focus() { this.focused = true }
    }
  }
  const elements = Object.fromEntries(['floating-logo', 'contact-toggle', 'contact-popup', 'whatsapp-link'].map(id => [id, element()]))
  if (withEmail) elements['email-link'] = element()
  elements['contact-popup'].hidden = true
  elements['contact-toggle'].attributes['aria-expanded'] = 'false'
  const document = {
    getElementById(id) { return elements[id] || null },
    addEventListener(name, handler) { documentHandlers[name] = handler }
  }
  vm.runInNewContext(fs.readFileSync('lib/js/contact.js', 'utf8'), { document, window: { open() {}, matchMedia() { return { matches: true } } } })
  documentHandlers.DOMContentLoaded()
  return { elements, documentHandlers }
}

test('contact menu opens, closes, and restores focus on Escape without email', () => {
  const { elements, documentHandlers } = setup()
  const toggle = elements['contact-toggle']
  const popup = elements['contact-popup']
  toggle.handlers.click()
  assert.equal(popup.hidden, false)
  assert.equal(toggle.attributes['aria-expanded'], 'true')
  documentHandlers.keydown({ key: 'Escape' })
  assert.equal(popup.hidden, true)
  assert.equal(toggle.attributes['aria-expanded'], 'false')
  assert.equal(toggle.focused, true)
})

test('mouse hover opens and closes the menu without affecting touch', () => {
  const { elements } = setup()
  const logo = elements['floating-logo']
  const popup = elements['contact-popup']
  const toggle = elements['contact-toggle']
  logo.handlers.pointerenter({ pointerType: 'touch' })
  assert.equal(popup.hidden, true)
  logo.handlers.pointerenter({ pointerType: 'mouse' })
  assert.equal(popup.hidden, false)
  assert.equal(toggle.attributes['aria-expanded'], 'true')
  logo.handlers.pointerleave({ pointerType: 'mouse' })
  assert.equal(popup.hidden, true)
  assert.equal(toggle.attributes['aria-expanded'], 'false')
})

test('closing waits for the fade and reopening cancels the pending hide', async () => {
  const { elements } = setup()
  const logo = elements['floating-logo']
  const popup = elements['contact-popup']
  let finish
  popup.getAnimations = () => [{ finished: new Promise(resolve => { finish = resolve }) }]
  logo.handlers.pointerenter({ pointerType: 'mouse' })
  logo.handlers.pointerleave({ pointerType: 'mouse' })
  assert.equal(popup.hidden, false)
  assert.equal(popup.inert, true)
  logo.handlers.pointerenter({ pointerType: 'mouse' })
  finish()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(popup.hidden, false)
  assert.equal(popup.inert, false)
  logo.handlers.pointerleave({ pointerType: 'mouse' })
  finish()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(popup.hidden, true)
})

test('optional email handler is registered when present', () => {
  assert.equal(typeof setup(true).elements['email-link'].handlers.click, 'function')
})

test('page starts with a hidden menu and permits zoom', () => {
  const html = fs.readFileSync('index.html', 'utf8')
  assert.match(html, /id="contact-popup" hidden/)
  assert.match(html, /id="contact-toggle"[^>]*aria-expanded="false"/)
  assert.doesNotMatch(html, /user-scalable=no|maximum-scale=1/)
})

test('WhatsApp has a real URL and contact labels support keyboard and touch', () => {
  const html = fs.readFileSync('index.html', 'utf8')
  const css = fs.readFileSync('lib/css/gr.css', 'utf8')
  const { elements } = setup()
  assert.match(html, /href="https:\/\/api\.whatsapp\.com\/send\?phone=8613531717068"[^>]*id="whatsapp-link"/)
  assert.equal(elements['whatsapp-link'].handlers.click, undefined)
  assert.match(css, /#contact-popup a:focus-visible \.tooltip/)
  assert.match(css, /@media \(hover: none\)\s*\{\s*#contact-popup \.tooltip/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.doesNotMatch(css, /animation:\s*(bounce|ripple)/)
})
