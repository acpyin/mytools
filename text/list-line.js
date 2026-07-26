(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function getSep() {
    const v = document.getElementById('sep').value;
    return v === '\\n' ? '\n' : v;
  }
  function prep(arr) {
    let a = arr;
    if (document.getElementById('trimChk').checked) a = a.map(x => x.trim());
    a = a.filter(Boolean);
    if (document.getElementById('uniqueChk').checked) a = [...new Set(a)];
    return a;
  }

  function toLines() {
    const sep = getSep();
    const items = prep(left.value.split(sep));
    right.value = items.join('\n');
    setStatus(`✓ ${items.length} 项`, 'ok');
  }
  function toList() {
    const sep = getSep();
    const items = prep(left.value.split('\n'));
    right.value = items.join(sep);
    setStatus(`✓ ${items.length} 项`, 'ok');
  }
  function init() {
    document.getElementById('linesBtn').addEventListener('click', toLines);
    document.getElementById('listBtn').addEventListener('click', toList);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='a,b,c,d,b'; toLines(); });
    left.value='apple,banana,cherry,apple';
    toLines();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
