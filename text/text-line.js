(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function init() {
    document.getElementById('emptyBtn').addEventListener('click', () => {
      right.value = left.value.split('\n').filter(x => x.trim() !== '').join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('dupBtn').addEventListener('click', () => {
      right.value = [...new Set(left.value.split('\n'))].join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('numBtn').addEventListener('click', () => {
      right.value = left.value.split('\n').map((x,i) => `${i+1}. ${x}`).join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('trimBtn').addEventListener('click', () => {
      right.value = left.value.split('\n').map(x => x.trimEnd()).join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('prefixBtn').addEventListener('click', () => {
      const p = document.getElementById('addText').value;
      right.value = left.value.split('\n').map(x => p + x).join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('suffixBtn').addEventListener('click', () => {
      const s = document.getElementById('addText').value;
      right.value = left.value.split('\n').map(x => x + s).join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='line1\n\nline2\nline1\nline3'; document.getElementById('emptyBtn').click(); });
    left.value='line1\n\nline2\nline1\nline3';
    document.getElementById('emptyBtn').click();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
