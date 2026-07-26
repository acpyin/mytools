(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s, c='') => { status.textContent = s; status.className = 'status-msg ' + c; };
  const indent = () => parseInt(document.getElementById('indentSel').value, 10) || 4;

  function format() {
    const s = left.value;
    if (!s.trim()) { right.value = ''; setStatus('空'); return; }
    try {
      const beautify = window.html_beautify || window.beautifier?.html;
      if (typeof beautify !== 'function') throw new Error('HTML Beautifier 未加载');
      right.value = beautify(s, { indent_size: indent(), wrap_line_length: 0 });
      setStatus('✓ 已美化', 'ok');
    } catch (e) { setStatus('失败：' + e.message, 'err'); }
  }
  function minify() {
    const source = left.value;
    if (!source.trim()) { right.value = ''; setStatus('空'); return; }
    try {
      let out = '';
      let i = 0;
      let rawTag = null;
      const lowerSource = source.toLowerCase();
      while (i < source.length) {
        if (rawTag) {
          const closeStart = lowerSource.indexOf(`</${rawTag}`, i);
          if (closeStart === -1) throw new Error(`<${rawTag}> 缺少结束标签`);
          out += source.slice(i, closeStart);
          i = closeStart;
        }
        if (source.startsWith('<!--', i)) {
          const end = source.indexOf('-->', i + 4);
          if (end === -1) throw new Error(`位置 ${i + 1} 的注释未闭合`);
          const comment = source.slice(i, end + 3);
          if (/^<!--\s*\[if/i.test(comment)) out += comment;
          i = end + 3;
          continue;
        }
        if (source[i] === '<') {
          let end = i + 1;
          let quote = '';
          while (end < source.length) {
            const ch = source[end];
            if (quote) {
              if (ch === quote) quote = '';
            } else if (ch === '"' || ch === "'") quote = ch;
            else if (ch === '>') break;
            end++;
          }
          if (end >= source.length) throw new Error(`位置 ${i + 1} 的标签未闭合`);
          const tag = source.slice(i, end + 1);
          out += tag;
          const match = tag.match(/^<\s*(\/?)\s*([A-Za-z][\w:-]*)/);
          if (match) {
            const name = match[2].toLowerCase();
            if (match[1] && rawTag === name) rawTag = null;
            else if (!match[1] && /^(pre|textarea|script|style)$/.test(name) && !/\/\s*>$/.test(tag)) rawTag = name;
          }
          i = end + 1;
          continue;
        }
        const next = source.indexOf('<', i);
        const end = next === -1 ? source.length : next;
        const text = source.slice(i, end);
        out += rawTag ? text : text.replace(/\s+/g, ' ');
        i = end;
      }
      right.value = out.trim();
      setStatus('✓ 已压缩', 'ok');
    } catch (e) { setStatus('失败：' + e.message, 'err'); }
  }
  function init() {
    document.getElementById('formatBtn').addEventListener('click', format);
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('swapBtn').addEventListener('click', () => { const t = left.value; left.value = right.value; right.value = t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value = ''; right.value = ''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value = '<div class="foo"><p>hello<b>world</b></p><ul><li>a</li><li>b</li></ul></div>'; format(); });
    left.value = '<div class="foo"><p>hello<b>world</b></p><ul><li>a</li><li>b</li></ul></div>';
    format();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
