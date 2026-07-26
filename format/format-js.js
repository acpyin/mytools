(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s, c='') => { status.textContent=s; status.className='status-msg '+c; };
  const indent = () => parseInt(document.getElementById('indentSel').value, 10) || 4;

  function format() {
    if (!left.value.trim()) { right.value=''; return; }
    try {
      const beautify = window.js_beautify || window.beautifier?.js;
      if (typeof beautify !== 'function') throw new Error('JS Beautifier 未加载');
      right.value = beautify(left.value, { indent_size: indent() });
      setStatus('✓ 已美化', 'ok');
    }
    catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  async function minify() {
    if (!left.value.trim()) { right.value = ''; setStatus('空'); return; }
    try {
      if (!window.Terser || typeof window.Terser.minify !== 'function') throw new Error('Terser 未加载');
      const result = await window.Terser.minify(left.value, {
        compress: false,
        mangle: false,
        format: { comments: false },
      });
      if (result.error) throw result.error;
      right.value = result.code || '';
      setStatus('✓ 已压缩', 'ok');
    } catch (e) { setStatus(e.message, 'err'); }
  }
  function init() {
    document.getElementById('formatBtn').addEventListener('click', format);
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value = 'function foo(a,b){var sum=a+b;return sum;}'; format(); });
    left.value = 'function foo(a,b){var sum=a+b;return sum;}function bar(){console.log("hi");}';
    format();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
