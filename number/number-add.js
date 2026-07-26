(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function apply(op) {
    const n = parseFloat(document.getElementById('addBy').value);
    const floor = document.getElementById('floorChk').checked;
    right.value = left.value.split('\n').map(line => {
      const v = parseFloat(line);
      if (isNaN(v)) return line;
      let r;
      if (op === '+') r = v + n;
      else if (op === '-') r = v - n;
      else r = v * n;
      return floor ? Math.round(r) : r;
    }).join('\n');
    setStatus('✓', 'ok');
  }
  function init() {
    document.getElementById('addBtn').addEventListener('click', () => apply('+'));
    document.getElementById('subBtn').addEventListener('click', () => apply('-'));
    document.getElementById('mulBtn').addEventListener('click', () => apply('*'));
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='10\n20\n30'; apply('+'); });
    left.value='100\n200\n300';
    apply('+');
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
