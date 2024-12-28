document.addEventListener("DOMContentLoaded", function () {
  const floatingLogo = document.getElementById("floating-logo");
  const contactPopup = document.getElementById("contact-popup");
  const whatsappLink = document.getElementById("whatsapp-link");
  const emailLink = document.getElementById("email-link");

  // 定义用户 WhatsApp 链接
  const whatsappUsers = [
    "https://wa.me/qr/ONTG6BQX2ICAD1",
    "https://wa.me/qr/ONTG6BQX2ICAD1",
    "https://wa.me/qr/ONTG6BQX2ICAD1",
  ];

  // 随机选择一个 WhatsApp 用户
  function getRandomWhatsappUser() {
    const randomIndex = Math.floor(Math.random() * whatsappUsers.length);
    return whatsappUsers[randomIndex];
  }

  // 定义用户邮箱
  const emails = [
    "sales01@great-will.com",
    "sales02@great-will.com",
    "sales03@great-will.com",
  ];

  // 随机选择一个邮箱
  function getRandomEmail() {
    const randomIndex = Math.floor(Math.random() * emails.length);
    return emails[randomIndex];
  }

  // 点击Logo时显示/隐藏联系方式弹出框
  floatingLogo.addEventListener("click", () => {
    contactPopup.classList.toggle("visible");
  });

  // 点击 WhatsApp 图标时跳转
  whatsappLink.addEventListener("click", (event) => {
    event.preventDefault(); // 防止默认行为
    const selectedUser = getRandomWhatsappUser();
    const whatsappUrl = `https://wa.me/${selectedUser}`; // 动态生成 WhatsApp 链接
    window.open(whatsappUrl, "_blank"); // 打开 WhatsApp 链接
  });

  // 点击 Email 图标时跳转
  emailLink.addEventListener("click", (event) => {
    event.preventDefault(); // 防止默认行为
    const selectedEmail = getRandomEmail();
    const mailtoUrl = `mailto:${selectedEmail}`; // 动态生成邮件链接
    window.open(mailtoUrl, "_blank"); // 打开邮件链接
  });

  // 点击页面其他地方时关闭弹出框
  document.addEventListener("click", (event) => {
    if (!floatingLogo.contains(event.target)) {
      contactPopup.classList.remove("visible");
    }
  });
});
