(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function format() {
    const s = left.value.trim().replace(/^\?/, '');
    if (!s) { right.value=''; return; }
    const pairs = s.split('&').filter(Boolean);
    const entries = [];
    for (const p of pairs) {
      const eq = p.indexOf('=');
      if (eq < 0) entries.push([p, '']);
      else entries.push([p.slice(0, eq), p.slice(eq + 1)]);
    }
    right.value = entries.map(([k,v]) => `${decodeURIComponent(k)} = ${decodeURIComponent(v)}`).join('\n');
    setStatus(`✓ ${entries.length} 项`, 'ok');
  }
  function minify() {
    const s = left.value;
    const pairs = s.split('\n').filter(Boolean).map(line => {
      const m = line.match(/^([^=]+)\s*=\s*(.*)$/);
      if (!m) return line;
      return encodeURIComponent(m[1].trim()) + '=' + encodeURIComponent(m[2].trim());
    });
    right.value = pairs.join('&');
    setStatus('✓ 已压缩', 'ok');
  }
  function init() {
    document.getElementById('formatBtn').addEventListener('click', format);
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value,'已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='name=%E5%B0%8F%E6%98%8E&age=18&city=Beijing'; format(); });
    left.value='name=%E5%B0%8F%E6%98%8E&age=18&city=Beijing';
    format();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
