document.addEventListener('DOMContentLoaded', function () {
  const floatingLogo = document.getElementById('floating-logo')
  const contactToggle = document.getElementById('contact-toggle')
  const contactPopup = document.getElementById('contact-popup')
  const emailLink = document.getElementById('email-link')

  // 定义用户邮箱
  const emails = [
    'sales01@great-will.com',
    'sales02@great-will.com',
    'sales03@great-will.com',
    'sales04@great-will.com',
    'sales05@great-will.com'
  ]

  // 通用随机选择函数
  function getRandomItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
      return null // 处理空数组或非数组情况
    }
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }

  // 点击Logo时显示/隐藏联系方式弹出框
  contactToggle.addEventListener('click', () => {
    const open = contactPopup.hidden
    contactPopup.hidden = !open
    contactPopup.classList.toggle('visible', open)
    contactToggle.setAttribute('aria-expanded', String(open))
  })

  // 关闭弹出框的辅助函数
  const closeContactPopup = () => {
    contactPopup.hidden = true
    contactPopup.classList.remove('visible')
    contactToggle.setAttribute('aria-expanded', 'false')
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !contactPopup.hidden) {
      closeContactPopup()
      contactToggle.focus()
    }
  })

  // 点击页面其他地方时关闭弹出框
  document.addEventListener('click', (event) => {
    // 检查点击是否在浮动Logo或弹出框外部
    if (floatingLogo && contactPopup &&
        !floatingLogo.contains(event.target) &&
        !contactPopup.contains(event.target)) {
      closeContactPopup()
    }
  })

  // 点击 Email 图标时跳转
  if (emailLink) emailLink.addEventListener('click', (event) => {
    event.preventDefault() // 防止默认行为
    const selectedEmail = getRandomItem(emails)
    if (selectedEmail) {
      const mailtoUrl = `mailto:${selectedEmail}` // 动态生成邮件链接
      window.open(mailtoUrl, '_blank') // 打开邮件链接
    }
  })

})
