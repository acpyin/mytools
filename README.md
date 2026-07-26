# MyTools

MyTools 是一个纯静态的在线工具集合，主要面向开发、文本处理和日常数据转换场景。

- 无需后端服务
- 数据默认只在浏览器本地处理
- 支持侧栏分类、折叠、滚动和最近使用记录
- 第三方运行库已存放在本地 `vendor/` 目录
- 支持直接部署到 Nginx 等静态 Web 服务



## 功能分类

当前菜单包含 10 个分类、52 个工具入口。

| 分类 | 主要工具 |
| --- | --- |
| 对比 | JSON 对比、文本对比 |
| JSON | JSON 格式化、对比、合并、JSONPath、Excel/XML/DICT/URL 转换 |
| 格式化 | HTML、CSS、JavaScript、XML、SQL 格式化 |
| 转换 | URL、Base64、Unicode、ASCII、Emoji、RGB、大小写等 |
| 分隔 | 逗号、环境变量、停顿、自定义分隔 |
| 文本 | 排序、行处理、压缩、字数统计、随机字符串、列表处理 |
| 数字 | 千分位、批量加减、补零 |
| 加解密 | MD5、SHA、SQL 引号转义 |
| 时间 | 时间戳转换、时间差、流水号 |
| 更多 | UUID v1–v5、正则、二维码、条形码、拼音、工具网站导航 |

## 目录结构

项目按照菜单分类组织。每个分类目录同时保存该分类的 HTML 页面和业务 JavaScript。

```text
mytool/
├─ index.html          # 根目录兼容入口，跳转到首页
├─ home/               # 首页
├─ compare/            # 对比工具
├─ json/               # JSON 工具
├─ format/             # 格式化工具
├─ convert/            # 转换工具
├─ split/              # 分隔工具
├─ text/               # 文本工具
├─ number/             # 数字工具
├─ crypto/             # 加解密工具
├─ time/               # 时间工具
├─ more/               # 其他工具
├─ shared/             # 公共脚本和公共样式
├─ vendor/             # 本地第三方库
├─ serve.py            # 本地无缓存静态服务器
├─ start.bat           # Windows 启动脚本
└─ inject-sidebar.py   # 侧栏注入辅助脚本
```

公共资源说明：

```text
shared/
├─ app-shell.js        # 生成侧栏和页面外壳
├─ tools-config.js     # 菜单分类与工具配置
├─ base.js             # 公共浏览器工具函数
├─ diff-settings.js    # 对比工具公共设置
├─ base.css            # 基础组件样式
├─ sidebar.css         # 侧栏和响应式布局
├─ editor.css          # 文本编辑器公共样式
└─ diff.css            # 对比页面公共样式
```

## 本地运行

项目支持以下两种打开方式：

- 直接双击根目录的 `index.html`
- 通过本地 HTTP 服务访问

菜单和公共资源均使用兼容 `file://` 与 HTTP 的相对路径。部分浏览器对
Web Worker、剪贴板等能力存在本地文件安全限制；需要使用这些功能时建议启动本地服务。

### Windows

双击：

```text
start.bat
```

然后访问：

```text
http://127.0.0.1:8766/
```

### 命令行

需要 Python 3：

```bash
python serve.py
```

本地服务器默认只监听 `127.0.0.1:8766`，并关闭浏览器缓存，便于开发调试。

## 添加新工具

1. 根据工具类型选择对应的分类目录。
2. 在分类目录内创建页面和业务脚本，例如：

   ```text
   convert/example.html
   convert/example.js
   ```

3. 页面引用公共资源：

   ```html
   <link rel="stylesheet" href="../shared/base.css">
   <link rel="stylesheet" href="../shared/sidebar.css">

   <script src="../shared/base.js"></script>
   <script src="../shared/tools-config.js"></script>
   <script src="../shared/app-shell.js"></script>
   <script src="example.js"></script>
   ```

4. 在 `shared/tools-config.js` 对应分类中增加菜单配置：

   ```js
   {
     href: '../convert/example.html',
     label: '示例工具',
     icon: 'EX',
     desc: '工具功能说明',
     slug: 'example',
   }
   ```

所有分类目录都位于同一层级，因此菜单使用 `../分类/页面.html`。这种写法既支持
HTTP 服务，也支持直接双击根目录 `index.html` 后以 `file://` 方式浏览。

## 第三方库

项目依赖的浏览器端库统一存放在 `vendor/`，包括：

- CodeMirror 和 MergeView
- diff-match-patch
- js-beautify
- sql-formatter
- Terser
- CSSO
- SheetJS
- pinyin-pro
- QRious
- JsBarcode

第三方版权与许可说明见：

```text
vendor/THIRD_PARTY_NOTICES.md
```

## Nginx 部署

将整个项目复制到站点目录，例如：

```text
/www/wwwroot/mytools
```

基础配置示例：

```nginx
server {
    listen 80;
    server_name _;

    root /www/wwwroot/mytools;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

检查并重载配置：

```bash
nginx -t
systemctl reload nginx
systemctl enable nginx
```

项目为纯静态页面，开机启动 Nginx 即可，不需要额外启动 Python 或 Node.js 服务。

## 开发注意事项

- 修改菜单时统一编辑 `shared/tools-config.js`。
- 工具页面应使用公共侧栏，不要复制一份静态菜单 HTML。
- 用户输入应通过 `textContent`、表单属性或安全转义后再插入 DOM。
- 大文本处理应避免阻塞主线程；正则工具已使用 Web Worker。
- 新增第三方依赖时优先本地化到 `vendor/`，避免页面运行依赖外部 CDN。
- 页面应提供清晰的键盘焦点、表单标签和复制结果反馈。

## 数据与隐私

格式化、转换、对比和生成操作均在浏览器中完成，输入内容不会主动上传到服务器。

“更多工具网站”页面包含第三方网站外链。打开第三方网站后，其隐私政策和数据处理方式由对应网站负责。
