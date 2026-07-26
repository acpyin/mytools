(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function format() {
    if (!left.value.trim()) { right.value=''; return; }
    try {
      if (!window.sqlFormatter || typeof window.sqlFormatter.format !== 'function') {
        throw new Error('SQL Formatter 未加载');
      }
      right.value = window.sqlFormatter.format(left.value, {
        language: document.getElementById('dialectSel').value,
        tabWidth: parseInt(document.getElementById('indentSel').value, 10),
        keywordCase: 'upper',
        linesBetweenQueries: 1,
      });
      setStatus('✓ 已美化', 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function minify() {
    const source = left.value;
    if (!source.trim()) { right.value = ''; setStatus('空'); return; }
    try {
      let out = '';
      let pendingSpace = false;
      let i = 0;
      const flushSpace = () => {
        if (pendingSpace && out && !/\s$/.test(out)) out += ' ';
        pendingSpace = false;
      };
      while (i < source.length) {
        const ch = source[i];
        const next = source[i + 1];
        if (/\s/.test(ch)) {
          pendingSpace = true;
          i++;
          continue;
        }
        if (ch === '-' && next === '-') {
          flushSpace();
          const end = source.indexOf('\n', i + 2);
          const stop = end === -1 ? source.length : end;
          out += source.slice(i, stop).trimEnd();
          if (end !== -1) out += '\n';
          pendingSpace = false;
          i = end === -1 ? stop : end + 1;
          continue;
        }
        if (ch === '/' && next === '*') {
          flushSpace();
          const end = source.indexOf('*/', i + 2);
          if (end === -1) throw new Error(`位置 ${i + 1} 的注释未闭合`);
          out += source.slice(i, end + 2);
          pendingSpace = true;
          i = end + 2;
          continue;
        }
        if (ch === "'" || ch === '"' || ch === '`' || ch === '[') {
          flushSpace();
          const close = ch === '[' ? ']' : ch;
          out += ch;
          i++;
          let closed = false;
          while (i < source.length) {
            out += source[i];
            if (source[i] === close) {
              if (source[i + 1] === close) {
                out += source[i + 1];
                i += 2;
                continue;
              }
              i++;
              closed = true;
              break;
            }
            if (source[i] === '\\' && close !== ']' && i + 1 < source.length) {
              out += source[i + 1];
              i += 2;
            } else i++;
          }
          if (!closed) throw new Error(`位置 ${i + 1} 的字符串或标识符未闭合`);
          continue;
        }
        flushSpace();
        out += ch;
        i++;
      }
      right.value = out.trim();
      setStatus('✓ 已压缩','ok');
    } catch (e) { setStatus('失败：' + e.message, 'err'); }
  }
  function init() {
    document.getElementById('formatBtn').addEventListener('click', format);
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value,'已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='select id,name from users where age>18 and active=1 order by id desc limit 10'; format(); });
    document.getElementById('dialectSel').addEventListener('change', format);
    document.getElementById('indentSel').addEventListener('change', format);
    left.value='select id,name,email from users where age>18 and active=1 order by id desc limit 10';
    format();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
