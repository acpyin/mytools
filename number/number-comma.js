(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function formatNum(s, keepDec) {
    const m = s.match(/^(-?)(\d+)(\.\d+)?$/);
    if (!m) return s;
    const sign = m[1], intPart = m[2], decPart = m[3] || '';
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + grouped + (keepDec ? decPart : '');
  }
  function add() {
    right.value = left.value.split('\n').map(l => formatNum(l.trim(), document.getElementById('decChk').checked)).join('\n');
    setStatus('✓', 'ok');
  }
  function rm() {
    right.value = left.value.replace(/,/g, '');
    setStatus('✓', 'ok');
  }
  function init() {
    document.getElementById('addBtn').addEventListener('click', add);
    document.getElementById('rmBtn').addEventListener('click', rm);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='1234567\n9876543.21\n-12345'; add(); });
    document.getElementById('decChk').checked = true;
    left.value='1234567\n9876543.21\n-12345';
    add();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
