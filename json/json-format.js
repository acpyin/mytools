(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');

  const state = { indent: 4, sort: false, bigInt: true };

  function getIndent() {
    const v = parseInt(document.getElementById('indentSel').value, 10);
    return v === 0 ? '\t' : ' '.repeat(v);
  }

  function sortKeys(obj) {
    if (Array.isArray(obj)) return obj.map(sortKeys);
    if (obj && typeof obj === 'object') {
      return Object.keys(obj).sort().reduce((acc, k) => {
        acc[k] = sortKeys(obj[k]);
        return acc;
      }, {});
    }
    return obj;
  }

  function bigIntReplacer(_k, v) {
    if (typeof v === 'bigint') return v.toString();
    return v;
  }

  function stringify(v) {
    const ind = getIndent();
    let s = JSON.stringify(v, bigIntReplacer, ind);
    if (state.bigInt) {
      s = s.replace(/(?<=[\s,:[(])\d{16,}(?=[\s,)\]}])/g, (m) => `"${m}"`);
    }
    return s;
  }

  function jsonToDict(s) {
    return s
      .replace(/true/g, 'True')
      .replace(/false/g, 'False')
      .replace(/null/g, 'None')
      .replace(/^\[$/, '[');
  }

  function dictToJson(s) {
    return s
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null');
  }

  function setStatus(text, cls = '') {
    status.textContent = text;
    status.className = 'status-msg ' + cls;
  }

  function updateMeta() {
    const lt = left.value, rt = right.value;
    document.getElementById('leftMeta').textContent =
      `${lt.length} 字符 / ${lt.split('\n').length} 行`;
    document.getElementById('rightMeta').textContent =
      `${rt.length} 字符 / ${rt.split('\n').length} 行`;
  }

  function tryFormat(showStatus = true) {
    const v = left.value;
    if (!v.trim()) { right.value = ''; updateMeta(); if (showStatus) setStatus('已清空', 'ok'); return; }
    const result = parseAny(v);
    if (result === null) { setStatus('解析失败：不是合法 JSON / DICT / 转义字符串', 'err'); return; }
    try {
      const sorted = state.sort ? sortKeys(result.value) : result.value;
      right.value = stringify(sorted);
      updateMeta();
      if (showStatus) setStatus('✓ 已格式化' + (result.kind !== 'json' ? (' （' + result.kind + '）') : ''), 'ok');
    } catch (e) {
      setStatus('格式化失败：' + e.message, 'err');
    }
  }

  function parseAny(s) {
    const t = s.trim();
    if (t.startsWith('"') && t.endsWith('"') && t.length >= 2) {
      try {
        const inner = JSON.parse(s);
        if (typeof inner === 'string') {
          const parsed = parseAny(inner);
          if (parsed !== null) return { value: parsed.value, kind: 'escaped' };
        }
      } catch (_) {}
    }
    try {
      const v = JSON.parse(s);
      if (v && typeof v === 'object') return { value: v, kind: 'json' };
    } catch (_) {}
    if (/^[{[]/.test(t)) {
      const c = t
        .replace(/\bNone\b/g, 'null')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/,True\b/g, ',true').replace(/\bTrue,/g, 'true,')
        .replace(/,False\b/g, ',false').replace(/\bFalse,/g, 'false,')
        .replace(/,None\b/g, ',null').replace(/\bNone,/g, 'null,')
        .replace(/'/g, '"')
        .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
      try {
        const v = JSON.parse(c);
        if (v && typeof v === 'object') return { value: v, kind: 'dict' };
      } catch (_) {}
    }
    return null;
  }

  function minify() {
    const r = parseAny(left.value);
    if (r === null) { setStatus('解析失败', 'err'); return; }
    right.value = JSON.stringify(r.value, bigIntReplacer);
    updateMeta();
    setStatus('✓ 已压缩' + (r.kind !== 'json' ? ' （' + r.kind + '）' : ''), 'ok');
  }

  function escape() {
    try {
      right.value = JSON.stringify(left.value);
      updateMeta();
      setStatus('✓ 已转义', 'ok');
    } catch (e) {
      setStatus('失败：' + e.message, 'err');
    }
  }

  function unescape() {
    const r = parseAny(left.value);
    if (r === null) { setStatus('解析失败', 'err'); return; }
    right.value = stringify(r.value);
    updateMeta();
    setStatus('✓ 已反转义', 'ok');
  }

  function doSort() {
    try {
      const r = parseAny(left.value);
      if (r === null) throw new Error('解析失败');
      right.value = stringify(sortKeys(r.value));
      updateMeta();
      setStatus('✓ 已排序', 'ok');
    } catch (e) { setStatus(e.message, 'err'); }
  }

  function toDict() {
    try {
      const r = parseAny(left.value);
      if (r === null) throw new Error('解析失败');
      right.value = jsonToDict(stringify(r.value));
      updateMeta();
      setStatus('✓ 已转为 DICT', 'ok');
    } catch (e) { setStatus(e.message, 'err'); }
  }

  function rmQuotes() {
    try {
      right.value = left.value
        .replace(/([{,]\s*)"([A-Za-z0-9_]+)"(\s*:)/g, '$1$2$3');
      updateMeta();
      setStatus('✓ 已去除 KEY 引号', 'ok');
    } catch (e) { setStatus(e.message, 'err'); }
  }

  function init() {
    // Upgrade both textareas to JSON editors with brace folding
    const leftEd = window.JsonEditor.upgrade(left, { mode: 'application/json' });
    const rightEd = window.JsonEditor.upgrade(right, { mode: 'application/json' });

    document.getElementById('formatBtn').addEventListener('click', () => tryFormat());
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('escapeBtn').addEventListener('click', escape);
    document.getElementById('unescapeBtn').addEventListener('click', unescape);
    document.getElementById('sortBtn').addEventListener('click', doSort);
    document.getElementById('toDictBtn').addEventListener('click', toDict);
    document.getElementById('rmQuotesBtn').addEventListener('click', rmQuotes);
    document.getElementById('clearBtn').addEventListener('click', () => { left.value = ''; right.value = ''; updateMeta(); setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      left.value = '"{\\"name\\": \\"MyTools\\", \\"v\\": 1, \\"tags\\": [\\"json\\",\\"format\\"], \\"nested\\": {\\"ok\\": true}}"';
      tryFormat();
    });
    document.getElementById('copyBtn').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('foldBtn').addEventListener('click', () => {
      leftEd && leftEd.foldAll();
      rightEd && rightEd.foldAll();
    });
    document.getElementById('unfoldBtn').addEventListener('click', () => {
      leftEd && leftEd.unfoldAll();
      rightEd && rightEd.unfoldAll();
    });

    document.getElementById('indentSel').addEventListener('change', (e) => { state.indent = parseInt(e.target.value, 10); tryFormat(); });
    document.getElementById('sortChk').addEventListener('change', (e) => { state.sort = e.target.checked; tryFormat(); });
    document.getElementById('bigIntChk').addEventListener('change', (e) => { state.bigInt = e.target.checked; tryFormat(); });

    let inputTimer = null;
    leftEd.cm.on('change', () => {
      updateMeta();
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => tryFormat(false), 350);
    });
    rightEd.cm.on('change', updateMeta);

    left.value = `{"name":"MyTools","version":"1.0.0","tags":["json","format"],"features":{"compact":false,"sort":true}}`;
    tryFormat();

    // Refresh CM after layout settles
    setTimeout(() => { leftEd.refresh(); rightEd.refresh(); }, 0);
    window.addEventListener('resize', () => { leftEd.refresh(); rightEd.refresh(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();