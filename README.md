# <p align="center">PDF 翻页书</p>

<https://pdfflipbook.vercel.app> - 演示

---

## 文档

### 问) PDF 中的翻页书页面不可见/显示异常

如果使用链接，请检查 PDF 文件，确保启用了跨域资源共享

## 文件结构

此翻页书插件基于 jQuery。基本上，您可以将文件夹中的文件复制到您的工作目录。您无需包含 lib 文件夹。

```
lib/ 
    ├── css/
    │   ├── min.css
    │   └── themify-icons.css
    │
    ├── fonts/
    │   ├── themify.eot
    │   ├── themify.svg
    │   ├── themify.ttf
    │   └── themify.woff
    │
    ├── images/
    │   └── loading.gif
    |
    ├── sound/
    │   └── turn2.mp3
    │
    └── js/
        ├── flip.js
        └── libs/
            ├── jquery.min.js
            ├── pdf.min.js
            ├── pdf.worker.min.js
            ├── three.min.js
            └── mockup.min.js

```

## 文件模板

并确保在 html 中包含以下文件。

### CSS

```
            
<!-- 翻页书样式表 -->
<link href="http://www.yoursite.com/lib/css/min.css" rel="stylesheet" type="text/css">

<!-- 图标样式表 -->
  <link href="http://www.yoursite.com/lib/css/themify-icons.css" rel="stylesheet" type="text css">
            
        
```

### JavaScript

注意：将它们包含在 </body> 标签之前。不要在 head 中使用。

```
            
<!-- jQuery 1.9.1 或更高版本 -->

<script src="http://www.yoursite.com/lib/js/libs/jquery.min.js" type="text/javascript"></script>


<!-- 翻页书主 JavaScript 文件 -->

<script src="http://www.yoursite.com/lib/js/flip.min.js" type="text/javascript"></script>
            
        
```

基本 HTML 模板

```

<html>
   <head>
       <meta charset="utf-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       
          <title>基本 HTML 模板</title>

     <!-- 翻页书样式表 -->
      <link href="http://www.yoursite.com/lib/css/min.css" rel="stylesheet" type="text/css">

     <!-- 图标样式表 -->
     <link href="http://www.yoursite.com/lib/css/themify-icons.css" rel="stylesheet" type="text/css">

   </head>
    <body>
    <div class="_df_thumb" id="df_manual_thumb" source="pdf文件位置.pdf" thumb="缩略图位置.jpg"> PDF 示例</div >
    <!-- 参考其他示例以了解如何创建不同类型的翻页书 -->

    <!-- jQuery 1.9.1 或更高版本 -->
    <script src="http://www.yoursite.com/lib/js/libs/jquery.min.js" type="text/javascript"></script>

    <!-- 翻页书主 JavaScript 文件 -->
    <script src="http://www.yoursite.com/lib/js/flip.min.js" type="text/javascript"></script>

    </body>
    </html>
```

通过按钮灯箱创建翻页书。

```
<div class="_df_button"
    source="http://www.yoursite.com/file.pdf"
    id="df_manual_button">
    按钮
</div>
```

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