(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function init() {
    document.getElementById('calcBtn').addEventListener('click', () => {
      const m = parseFloat(document.getElementById('mult').value) || 0;
      const a = parseFloat(document.getElementById('add').value) || 0;
      const lines = left.value.split('\n');
      const out = [];
      let sum = 0, max = -Infinity, min = Infinity, valid = 0;
      for (const ln of lines) {
        const trimmed = ln.trim();
        if (!trimmed) { out.push(''); continue; }
        const numMatch = /^-?\d+(\.\d+)?$/.test(trimmed);
        if (!numMatch) { out.push(ln); continue; }
        const n = parseFloat(trimmed);
        const r = n * m + a;
        out.push(String(r));
        sum += r; max = Math.max(max, r); min = Math.min(min, r); valid++;
      }
      if (document.getElementById('sumChk').checked && valid > 0) {
        const avg = (sum / valid).toFixed(4);
        out.push('--');
        out.push(`合计: ${sum}`);
        out.push(`平均: ${avg}`);
        out.push(`最大: ${max}`);
        out.push(`最小: ${min}`);
        out.push(`行数: ${valid}`);
      }
      right.value = out.join('\n');
      setStatus('✓ 已计算', 'ok');
    });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='10\n20\n30\n40'; document.getElementById('calcBtn').click(); });
    left.value='10\n20\n30\n40';
    document.getElementById('sumChk').checked = true;
    document.getElementById('calcBtn').click();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
