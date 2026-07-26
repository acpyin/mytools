(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function encode() {
    try {
      const o = JSON.parse(left.value);
      const parts = [];
      function walk(p, v) {
        if (v === null || v === undefined) { parts.push(`${encodeURIComponent(p)}=`); return; }
        if (Array.isArray(v)) v.forEach((it, i) => walk(p + '[' + i + ']', it));
        else if (typeof v === 'object') Object.entries(v).forEach(([k, vv]) => walk(p + '[' + k + ']', vv));
        else parts.push(`${encodeURIComponent(p)}=${encodeURIComponent(v)}`);
      }
      Object.entries(o).forEach(([k, v]) => walk(k, v));
      right.value = parts.join('&');
      setStatus('✓ 已编码', 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function decode() {
    try {
      const s = left.value.replace(/^\?/, '');
      const pairs = s.split('&').filter(Boolean);
      const params = new Map();
      for (const p of pairs) {
        const eq = p.indexOf('=');
        if (eq < 0) params.set(decodeURIComponent(p), '');
        else params.set(decodeURIComponent(p.slice(0, eq)), decodeURIComponent(p.slice(eq + 1)));
      }
      const o = {};
      for (const [k, v] of params) {
        // bracket keys: a[b]=1, a[0]=1
        const m = k.match(/^([^[]+)(\[(.*)\])?$/);
        if (!m) { o[k] = v; continue; }
        const root = m[1]; const rest = m[3];
        if (!rest) { o[root] = v; continue; }
        const segs = rest.match(/[^[\]]+/g) || [];
        let cur = o;
        for (let i = 0; i < segs.length - 1; i++) {
          if (cur[segs[i]] === undefined) cur[segs[i]] = /^\d+$/.test(segs[i + 1]) ? [] : {};
          cur = cur[segs[i]];
        }
        const last = segs[segs.length - 1];
        cur[last] = v;
      }
      right.value = JSON.stringify(o, null, 2);
      setStatus('✓ 已解码', 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function init() {
    document.getElementById('encodeBtn').addEventListener('click', encode);
    document.getElementById('decodeBtn').addEventListener('click', decode);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value,'已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='{"name":"小明","tags":["a","b"]}'; encode(); });
    left.value='{"name":"小明","age":18}';
    encode();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
