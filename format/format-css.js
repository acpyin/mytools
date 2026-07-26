(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s, c='') => { status.textContent=s; status.className='status-msg '+c; };
  const indent = () => parseInt(document.getElementById('indentSel').value, 10) || 4;

  function format() {
    if (!left.value.trim()) { right.value = ''; return; }
    try {
      const beautify = window.css_beautify || window.beautifier?.css;
      if (typeof beautify !== 'function') throw new Error('CSS Beautifier 未加载');
      right.value = beautify(left.value, { indent_size: indent() });
      setStatus('✓ 已美化', 'ok');
    }
    catch (e) { setStatus('失败：' + e.message, 'err'); }
  }
  function minify() {
    if (!left.value.trim()) { right.value = ''; setStatus('空'); return; }
    try {
      if (!window.csso || typeof window.csso.minify !== 'function') throw new Error('CSSO 未加载');
      right.value = window.csso.minify(left.value, { restructure: false }).css;
      setStatus('✓ 已压缩', 'ok');
    } catch (e) { setStatus(e.message, 'err'); }
  }
  function init() {
    document.getElementById('formatBtn').addEventListener('click', format);
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value = '.foo{color:red;border:1px solid #ccc;display:flex;align-items:center}'; format(); });
    left.value = '.foo{color:red;border:1px solid #ccc;display:flex;align-items:center}.bar{padding:10px;margin:0 auto}';
    format();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
