/* config.js — single source of truth for all tools + categories. */
/* Used by sidebar.js and home grid. */

window.TOOLS_CONFIG = [
  {
    name: '对比', icon: '⇄',
    items: [
      { href: '../json/json-diff.html', label: 'JSON 对比', icon: '{ ', desc: '行级差异高亮', slug: 'json-diff' },
      { href: '../compare/text-diff.html', label: '文本对比', icon: 'Aa', desc: '两段文本差异', slug: 'text-diff' },
    ],
  },
  {
    name: 'JSON', icon: '{ }',
    items: [
      { href: '../json/json-format.html', label: 'JSON 格式化', icon: '{ ', desc: '格式化/压缩/转义/排序', slug: 'json-format' },
      { href: '../json/json-diff.html', label: 'JSON 对比', icon: '⇄', desc: '行级差异高亮', slug: 'json-diff' },
      { href: '../json/json-merge.html', label: 'JSON 合并', icon: '∪', desc: '深合并两个 JSON', slug: 'json-merge' },
      { href: '../json/jsonpath.html', label: 'JSONPath', icon: '$.', desc: '提取 JSON 路径值', slug: 'jsonpath' },
      { href: '../json/excel-json.html', label: 'Excel ↔ JSON', icon: 'XJ', desc: '表格与 JSON 双向转换', slug: 'excel-json' },
      { href: '../json/xml-json.html', label: 'XML ↔ JSON', icon: 'XJ', desc: 'XML 与 JSON 互转', slug: 'xml-json' },
      { href: '../json/json-url.html', label: 'JSON URL 编码', icon: '%J', desc: 'JSON 参数 URL 编码', slug: 'json-url' },
      { href: '../json/json-dict.html', label: 'JSON ↔ DICT', icon: '{}', desc: 'JSON 与 DICT 互转', slug: 'json-dict' },
    ],
  },
  {
    name: '格式化', icon: '✦',
    items: [
      { href: '../format/html-format.html', label: 'HTML 格式化', icon: '<>', desc: '美化 HTML', slug: 'html-format' },
      { href: '../format/css-format.html', label: 'CSS 格式化', icon: 'CSS', desc: '美化 CSS', slug: 'css-format' },
      { href: '../format/js-format.html', label: 'JS 格式化', icon: 'JS', desc: '美化 JavaScript', slug: 'js-format' },
      { href: '../format/xml-format.html', label: 'XML 格式化', icon: 'XML', desc: '美化 XML', slug: 'xml-format' },
      { href: '../format/sql-format.html', label: 'SQL 格式化', icon: 'SQL', desc: '美化 SQL 关键字', slug: 'sql-format' },
    ],
  },
  {
    name: '转换', icon: '⇋',
    items: [
      { href: '../convert/url-encode.html', label: 'URL 编码', icon: '%', desc: 'encodeURIComponent', slug: 'url-encode' },
      { href: '../convert/base64.html', label: 'Base64 编解码', icon: 'B64', desc: '文本/Base64 互转', slug: 'base64' },
      { href: '../convert/image-base64.html', label: '图片 Base64', icon: 'IMG', desc: '图片转 Base64', slug: 'image-base64' },
      { href: '../convert/urlparam-format.html', label: 'URL 参数格式化', icon: '?&', desc: '美化 querystring', slug: 'urlparam-format' },
      { href: '../convert/unicode-chinese.html', label: 'Unicode 中文', icon: '中', desc: '中文 ↔ \\uXXXX', slug: 'unicode-chinese' },
      { href: '../convert/ascii.html', label: 'ASCII 表', icon: '0x', desc: '字符与编码对照', slug: 'ascii' },
      { href: '../convert/emoji.html', label: 'Emoji 表', icon: '😀', desc: '搜索并复制常用 Emoji', slug: 'emoji' },
      { href: '../convert/rgb-colors.html', label: 'RGB 工具', icon: 'RGB', desc: 'RGB/HEX 互转、颜色对照与精选配色', slug: 'rgb-colors' },
      { href: '../convert/change-case.html', label: '大小写转换', icon: 'Aa', desc: '驼峰/下划线/常量', slug: 'change-case' },
      { href: '../convert/camel-underline.html', label: '驼峰转下划线', icon: '_', desc: 'aBc ↔ a_bc', slug: 'camel-underline' },
    ],
  },
  {
    name: '分隔', icon: '✂',
    items: [
      { href: '../split/comma-split.html', label: '逗号分隔', icon: ',', desc: '逗号分隔字符串', slug: 'comma-split' },
      { href: '../split/env-split.html', label: '环境变量分隔', icon: '$', desc: '.env 解析', slug: 'env-split' },
      { href: '../split/pause-split.html', label: '停顿分隔', icon: '⏸', desc: '句号/换行分隔', slug: 'pause-split' },
      { href: '../split/my-split.html', label: '自定义分隔', icon: '|', desc: '自定义规则分隔', slug: 'my-split' },
    ],
  },
  {
    name: '文本', icon: '≡',
    items: [
      { href: '../text/text-sort.html', label: '文本排序', icon: '⇅', desc: '按行排序/去重', slug: 'text-sort' },
      { href: '../text/text-line.html', label: '文本行操作', icon: '☰', desc: '删除空行/重复行', slug: 'text-line' },
      { href: '../text/text-compress.html', label: '文本压缩', icon: '↓', desc: '去除多余空白', slug: 'text-compress' },
      { href: '../text/word-count.html', label: '字数统计', icon: '∑', desc: '字符/词数统计', slug: 'word-count' },
      { href: '../text/random-str.html', label: '随机字符串', icon: '?r', desc: '批量生成', slug: 'random-str' },
      { href: '../text/list-line.html', label: '列表 → 行', icon: '☰', desc: '逗号列表 ↔ 行', slug: 'list-line' },
      { href: '../text/list-calc.html', label: '列表计算', icon: '+', desc: '对每行做计算', slug: 'list-calc' },
    ],
  },
  {
    name: '数字', icon: '#',
    items: [
      { href: '../number/number-comma.html', label: '千分位', icon: '1,000', desc: '数字加千分位', slug: 'number-comma' },
      { href: '../number/number-add.html', label: '数字加减', icon: '±', desc: '对每行数字加减', slug: 'number-add' },
      { href: '../number/number-zero.html', label: '补零', icon: '001', desc: '位对齐补零', slug: 'number-zero' },
    ],
  },
  {
    name: '加解密', icon: '🔒',
    items: [
      { href: '../crypto/hash.html', label: 'MD5 / SHA', icon: '#', desc: '字符串摘要', slug: 'hash' },
      { href: '../crypto/md5.html', label: 'MD5', icon: 'M5', desc: 'MD5 加密', slug: 'md5' },
      { href: '../crypto/sha.html', label: 'SHA', icon: 'SH', desc: 'SHA-1/256/512', slug: 'sha' },
      { href: '../crypto/sql-quote.html', label: 'SQL 引号', icon: "''", desc: 'SQL 单引号转义', slug: 'sql-quote' },
    ],
  },
  {
    name: '时间', icon: '⌚',
    items: [
      { href: '../time/timestamp.html', label: '时间戳转换', icon: '⌚', desc: 'Unix 时间戳 ⇄ 日期', slug: 'timestamp' },
      { href: '../time/time-diff.html', label: '时间差计算', icon: '⏱', desc: '两个日期相差', slug: 'time-diff' },
      { href: '../time/serial-number.html', label: '流水号生成', icon: '#1', desc: '自增编号', slug: 'serial-number' },
    ],
  },
  {
    name: '更多', icon: '⋯',
    items: [
      { href: '../more/uuid.html', label: 'UUID 生成器', icon: 'UUID', desc: '生成 v1 到 v5 UUID', slug: 'uuid' },
      { href: '../more/regex.html', label: '正则测试', icon: '/.*/', desc: '实时匹配高亮', slug: 'regex' },
      { href: '../more/qrcode.html', label: '二维码', icon: 'QR', desc: '生成二维码', slug: 'qrcode' },
      { href: '../more/barcode.html', label: '条形码', icon: '|||', desc: '生成条形码', slug: 'barcode' },
      { href: '../more/pinyin.html', label: '拼音', icon: '拼', desc: '汉字转拼音', slug: 'pinyin' },
      { href: '../more/free-online-tools.html', label: '更多工具网站', icon: '↗', desc: '常用免费在线工具导航', slug: 'free-online-tools' },
    ],
  },
];
