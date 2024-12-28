document.addEventListener("DOMContentLoaded", function () {
  const floatingLogo = document.getElementById("floating-logo");
  const contactPopup = document.getElementById("contact-popup");
  const whatsappLink = document.getElementById("whatsapp-link");
  const emailLink = document.getElementById("email-link");
  const skypeLink = document.getElementById("skype-link");

  // 定义用户 WhatsApp 链接
  const whatsappUsers = [
    "ONTG6BQX2ICAD1",  // Jackson
    "RNBIH6BIOU3JL1",  // Kero
    "THEAJUT2I2OXO1",  // Alice
    "UMJ5QX4PWN2CJ1",  // Yvonne
    "ZZA5JKF44ZLCH1",  // KK
  ];

  // 定义用户邮箱
  const emails = [
    "sales01@great-will.com",
    "sales02@great-will.com",
    "sales03@great-will.com",
    "sales04@great-will.com",
    "sales05@great-will.com",
  ];

  // 定义用户 Skype ID
  const skypeID = [
    "GW-Alice0905",
    "18211382613",
    "Kero%20Liu",
    "kensonkoo",
    "Yvonne%20Chen",
  ];

  // 随机选择一个 WhatsApp 用户
  function getRandomWhatsappUser() {
    const randomIndex = Math.floor(Math.random() * whatsappUsers.length);
    return whatsappUsers[randomIndex];
  }

  // 随机选择一个邮箱
  function getRandomEmail() {
    const randomIndex = Math.floor(Math.random() * emails.length);
    return emails[randomIndex];
  }

  // 随机选择一个Skype ID
  function getRandomSkypeID() {
    const randomIndex = Math.floor(Math.random() * skypeID.length);
    return skypeID[randomIndex];
  }

  // 点击Logo时显示/隐藏联系方式弹出框
  floatingLogo.addEventListener("click", () => {
    contactPopup.classList.toggle("visible");
  });

  // 点击 WhatsApp 图标时跳转
  whatsappLink.addEventListener("click", (event) => {
    event.preventDefault(); // 防止默认行为
    const selectedUser = getRandomWhatsappUser();
    const whatsappUrl = `https://wa.me/qr/${selectedUser}`; // 动态生成 WhatsApp 链接
    window.open(whatsappUrl, "_blank"); // 打开 WhatsApp 链接
  });

  // 点击 Email 图标时跳转
  emailLink.addEventListener("click", (event) => {
    event.preventDefault(); // 防止默认行为
    const selectedEmail = getRandomEmail();
    const mailtoUrl = `mailto:${selectedEmail}`; // 动态生成邮件链接
    window.open(mailtoUrl, "_blank"); // 打开邮件链接
  });

  // 点击 Skype 图标时跳转
  skypeLink.addEventListener("click", (event) => {
    event.preventDefault(); // 防止默认行为
    const selectedSkypeID = getRandomSkypeID();
    const skypeUrl = `skype:${selectedSkypeID}?chat`; // 动态生成 Skype 链接
    window.open(skypeUrl, "_blank"); // 打开 Skype 链接
  });

  // 点击页面其他地方时关闭弹出框
  document.addEventListener("click", (event) => {
    if (!floatingLogo.contains(event.target)) {
      contactPopup.classList.remove("visible");
    }
  });
});
