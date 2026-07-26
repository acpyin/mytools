(() => {
  const list = document.getElementById('list');
  function pad(n, w) { return String(n).padStart(w, '0'); }
  function datePart(fmt) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return fmt.replace('yyyy', y).replace('MM', m).replace('dd', da);
  }
  function gen() {
    const prefix = document.getElementById('prefix').value;
    const start = parseInt(document.getElementById('start').value, 10) || 1;
    const count = Math.min(1000, Math.max(1, parseInt(document.getElementById('count').value, 10)));
    const width = Math.max(1, parseInt(document.getElementById('width').value, 10));
    const dfmt = document.getElementById('dateFmt').value;
    const dp = dfmt ? datePart(dfmt) : '';
    list.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const n = start + i;
      const v = `${prefix}${dp}${pad(n, width)}`;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;background:#fff;border:1px solid var(--border);border-radius:6px;font-family:SFMono-Regular,Consolas,monospace;font-size:12px;';
      const index = document.createElement('span');
      index.textContent = `${i + 1}.`;
      const value = document.createElement('span');
      value.style.wordBreak = 'break-all';
      value.textContent = v;
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'btn';
      copy.style.marginLeft = 'auto';
      copy.dataset.copy = v;
      copy.textContent = '复制';
      row.append(index, value, copy);
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
    ['prefix','start','count','width','dateFmt'].forEach(id => document.getElementById(id).addEventListener('input', gen));
    gen();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
