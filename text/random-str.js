(() => {
  const list = document.getElementById('list');

  function charset() {
    let s = '';
    if (document.getElementById('lowerChk').checked) s += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('upperChk').checked) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('numChk').checked) s += '0123456789';
    if (document.getElementById('symChk').checked) s += '!@#$%^&*()-_=+[]{};:,.<>?/~`';
    return s;
  }
  function genStr(len, chs) {
    const r = new Uint32Array(len);
    crypto.getRandomValues(r);
    let out = '';
    for (let i = 0; i < len; i++) out += chs[r[i] % chs.length];
    return out;
  }

  function gen() {
    const len = Math.max(1, parseInt(document.getElementById('len').value, 10) || 8);
    const n = Math.min(500, Math.max(1, parseInt(document.getElementById('count').value, 10) || 1));
    const chs = charset();
    if (!chs) { window.toast('至少选一种字符'); return; }
    list.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const v = genStr(len, chs);
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#fff;border:1px solid var(--border);border-radius:6px;font-family:SFMono-Regular,Consolas,monospace;font-size:12px;';
      row.innerHTML = `<span>${i+1}.</span><span style="word-break:break-all;">${v}</span><button class="btn" style="margin-left:auto;" data-copy="${v}">复制</button>`;
      list.appendChild(row);
    }
  }
  function init() {
    document.getElementById('genBtn').addEventListener('click', gen);
    document.getElementById('copyAll').addEventListener('click', () => {
      const vals = [...document.querySelectorAll('#list > div > span:nth-of-type(2)')].map(e => e.textContent);
      window.copyText(vals.join('\n'), '已复制');
    });
    list.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-copy]');
      if (b) window.copyText(b.dataset.copy, '已复制');
    });
    ['len','count','lowerChk','upperChk','numChk','symChk'].forEach(id => document.getElementById(id).addEventListener('change', gen));
    gen();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
