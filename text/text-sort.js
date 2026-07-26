(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function getLines() { return left.value.split('\n').map(x => x).filter((_, i, arr) => arr.indexOf(arr[i]) === i); }

  function lines() {
    return left.value.split('\n').map(s => s).filter(x => x.trim() !== '' || true).map(x => x);
  }

  function doSort() {
    const dir = document.getElementById('dirSel').value;
    const caseSensitive = document.getElementById('caseChk').checked;
    const numeric = document.getElementById('numericChk').checked;
    let arr = left.value.split('\n');
    const collator = caseSensitive ? (a,b)=>a.localeCompare(b) : (a,b)=>a.localeCompare(b, undefined, { sensitivity: 'base' });
    arr.sort((a,b) => {
      if (numeric) {
        const na = parseFloat(a), nb = parseFloat(b);
        if (!isNaN(na) && !isNaN(nb)) return dir === 'asc' ? na - nb : nb - na;
      }
      return dir === 'asc' ? collator(a,b) : collator(b,a);
    });
    right.value = arr.join('\n');
    setStatus('✓ 已排序', 'ok');
  }
  function doUnique() {
    const arr = left.value.split('\n');
    right.value = [...new Set(arr)].join('\n');
    setStatus('✓ 已去重', 'ok');
  }
  function reverse() { right.value = left.value.split('\n').reverse().join('\n'); setStatus('✓ 已反转', 'ok'); }
  function shuffle() {
    const arr = left.value.split('\n');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    right.value = arr.join('\n');
  }
  function trimLines() { right.value = left.value.split('\n').map(x => x.trim()).join('\n'); setStatus('✓ 已去空白', 'ok'); }

  function init() {
    document.getElementById('sortBtn').addEventListener('click', doSort);
    document.getElementById('uniqueBtn').addEventListener('click', doUnique);
    document.getElementById('reverseBtn').addEventListener('click', reverse);
    document.getElementById('shuffleBtn').addEventListener('click', shuffle);
    document.getElementById('trimBtn').addEventListener('click', trimLines);
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='banana\napple\ncherry\ndate\napple'; doSort(); });
    left.value='banana\napple\ncherry\ndate\napple';
    doSort();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
