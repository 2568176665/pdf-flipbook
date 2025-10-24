document.addEventListener('DOMContentLoaded', function () {
  const floatingLogo = document.getElementById('floating-logo')
  const contactPopup = document.getElementById('contact-popup')
  const whatsappLink = document.getElementById('whatsapp-link')
  const emailLink = document.getElementById('email-link')

  // 定义用户 WhatsApp 链接
  const whatsappUsers = [
    '8613531717068', // Anny
    // '8613665099712', // Kero
    // '8613829965092', // Alice
    // '8613597725406', // Evan
    // '8613824216149' // KK
  ]

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
  floatingLogo.addEventListener('click', () => {
    contactPopup.classList.toggle('visible')
    floatingLogo.style.animation = 'none';
  })

  // 关闭弹出框的辅助函数
  const closeContactPopup = () => {
    if (contactPopup && contactPopup.classList.contains('visible')) {
      contactPopup.classList.remove('visible')
    }
  }

  // 点击页面其他地方时关闭弹出框
  document.addEventListener('click', (event) => {
    // 检查点击是否在浮动Logo或弹出框外部
    if (floatingLogo && contactPopup &&
        !floatingLogo.contains(event.target) &&
        !contactPopup.contains(event.target)) {
      closeContactPopup()
    }
  })

  // 点击 WhatsApp 图标时跳转
  whatsappLink.addEventListener('click', (event) => {
    event.preventDefault() // 防止默认行为
    const selectedUser = getRandomItem(whatsappUsers)
    if (selectedUser) {
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${selectedUser}` // 动态生成 WhatsApp 链接
      window.open(whatsappUrl, '_blank') // 打开 WhatsApp 链接
    }
  })

  // 点击 Email 图标时跳转
  emailLink.addEventListener('click', (event) => {
    event.preventDefault() // 防止默认行为
    const selectedEmail = getRandomItem(emails)
    if (selectedEmail) {
      const mailtoUrl = `mailto:${selectedEmail}` // 动态生成邮件链接
      window.open(mailtoUrl, '_blank') // 打开邮件链接
    }
  })

})
