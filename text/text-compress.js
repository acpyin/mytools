(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function init() {
    document.getElementById('compressBtn').addEventListener('click', () => {
      let s = left.value;
      if (document.getElementById('multiWsChk').checked) s = s.replace(/[ \t]{2,}/g, ' ');
      if (document.getElementById('trimLinesChk').checked) s = s.split('\n').map(x => x.trimEnd()).join('\n');
      if (document.getElementById('skipEmptyChk').checked) s = s.split('\n').filter(x => x.trim()).join('\n');
      right.value = s;
      const before = left.value.length, after = s.length;
      setStatus(`✓  ${before} → ${after} 字符（-${((1 - after/before) * 100).toFixed(1)}%）`, 'ok');
    });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      left.value='line1    \n\n   line2  \n\nline1    \nline3   ';
      document.getElementById('compressBtn').click();
    });
    document.getElementById('compressBtn').click();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
