(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function init() {
    document.getElementById('encodeBtn').addEventListener('click', () => {
      const doubling = document.getElementById('doublingChk').checked;
      if (doubling) right.value = left.value.replace(/'/g, '\'\'');
      else right.value = left.value.replace(/'/g, '\\\'');
      setStatus('✓', 'ok');
    });
    document.getElementById('decodeBtn').addEventListener('click', () => {
      right.value = left.value.replace(/''/g, "'").replace(/\\'/g, "'");
      setStatus('✓', 'ok');
    });
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value="O'Reilly's book"; document.getElementById('encodeBtn').click(); });
    left.value="O'Reilly's book";
    document.getElementById('encodeBtn').click();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
