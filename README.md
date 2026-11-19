# <p align="center">PDF 翻页书</p>

<https://pdfflipbook.vercel.app> - 演示

---

## 文档

### 问) PDF 中的翻页书页面不可见/显示异常

如果使用跨域 PDF 链接，请确保提供 PDF 的服务器允许跨域资源共享（CORS）。本地预览时请通过 HTTP 服务访问页面，而不是直接打开文件。

## 文件结构

此翻页书插件基于 jQuery。集成时请保留 `lib` 目录及其内部结构：插件会根据 `flip.js` 的位置加载 PDF.js、worker、字体映射、图片和音效等资源。

```text
lib/
├── css/
│   ├── main.css
│   ├── themify-icons.min.css
│   └── gr.css                    # 项目页面样式
├── fonts/                        # 图标字体
├── images/                       # 背景图、加载图及 PDF.js 图片
├── js/
│   ├── flip.js
│   ├── contact.js                # 项目页面的联系方式脚本
│   └── libs/                     # jQuery、PDF.js、worker、Three.js 等
│       └── cmaps/                # PDF 字体映射
├── pdf/
│   └── Product Catalog.pdf       # 示例 PDF
└── sound/                        # 翻页音效
```

## 集成示例

以下示例假设 HTML 文件与 `lib` 目录位于同一级。通过 HTTP 服务打开该页面，插件会自动从 `lib` 加载所需资源。可将 PDF 路径替换为自己的文件或支持 CORS 的地址。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PDF 翻页书</title>
  <link href="lib/css/main.css" rel="stylesheet">
  <link href="lib/css/themify-icons.min.css" rel="stylesheet">
</head>
<body>
  <div id="productBrochure"></div>

  <script src="lib/js/libs/jquery.min.js"></script>
  <script src="lib/js/flip.js"></script>
  <script>
    jQuery(document).ready(function () {
      var pdf = 'lib/pdf/Product Catalog.pdf'
      var options = {
        height: 2000,
        duration: 700,
        backgroundImage: 'lib/images/bg.webp',
        soundEnable: true,
        useTouch: true,
        enableDownload: true,
        singlePageMode: true,
      }
      $('#productBrochure').flipBook(pdf, options)
    })
  </script>
</body>
</html>
```

仓库中的 `index.html` 使用相同的初始化方式，并额外引入 `lib/css/gr.css` 和 `lib/js/contact.js` 来展示项目的联系方式。

---

### 贡献者

- [@HiIamChaitanya](https://www.github.com/HiIamChaitanya)

---

### 致谢

- [pdf.js]()
- [three.js]()
- [jquery]()
- [dflip]()

---
