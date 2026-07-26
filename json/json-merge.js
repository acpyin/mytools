(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const result = document.getElementById('result');
  const status = document.getElementById('status');
  const statusOut = document.getElementById('statusOut');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; statusOut.textContent = s; };

  function deepMerge(a, b, bWins) {
    if (a === null || a === undefined) return b;
    if (b === null || b === undefined) return a;
    if (typeof a !== 'object' || typeof b !== 'object') return bWins ? b : a;
    if (Array.isArray(a) !== Array.isArray(b)) return bWins ? b : a;
    if (Array.isArray(a)) {
      const out = bWins ? [...b, ...a.filter(x => !b.some(y => JSON.stringify(y) === JSON.stringify(x)))] : [...a, ...b.filter(x => !a.some(y => JSON.stringify(y) === JSON.stringify(x)))];
      return out;
    }
    const out = { ...a };
    for (const k of Object.keys(b)) {
      out[k] = deepMerge(a[k], b[k], bWins);
    }
    return out;
  }

  function merge() {
    let A, B;
    try { A = JSON.parse(left.value || '{}'); } catch (e) { setStatus('A 不是 JSON: '+e.message, 'err'); return; }
    try { B = JSON.parse(right.value || '{}'); } catch (e) { setStatus('B 不是 JSON: '+e.message, 'err'); return; }
    const bWin = document.getElementById('bWinChk').checked;
    try {
      const merged = deepMerge(A, B, bWin);
      result.value = JSON.stringify(merged, null, 2);
      setStatus('✓ 已合并', 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }

  function init() {
    document.getElementById('mergeBtn').addEventListener('click', merge);
    document.getElementById('copyR').addEventListener('click', () => window.copyText(result.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; result.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      left.value = '{"name":"a","v":1,"tags":["x","y"],"opt":{"deep":1}}';
      right.value = '{"name":"b","v":2,"tags":["y","z"],"opt":{"deep":2,"extra":true}}';
      merge();
    });
    left.value = '{"name":"a","v":1,"tags":["x","y"],"opt":{"deep":1}}';
    right.value = '{"name":"b","v":2,"tags":["y","z"],"opt":{"deep":2,"extra":true}}';
    merge();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
