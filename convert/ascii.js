(() => {
  const grid = document.getElementById('grid');
  const rangeSel = document.getElementById('rangeSel');
  const filter = document.getElementById('filter');

  function inRange(code, sel) {
    if (sel === 'all') return code <= 127;
    if (sel === 'control') return (code <= 31) || code === 127;
    if (sel === 'print') return code >= 32 && code <= 126;
    if (sel === 'digit') return code >= 48 && code <= 57;
    if (sel === 'upper') return code >= 65 && code <= 90;
    if (sel === 'lower') return code >= 97 && code <= 122;
    return false;
  }

  function render() {
    const sel = rangeSel.value;
    const f = filter.value.trim().toLowerCase();
    grid.innerHTML = '';
    for (let code = 0; code <= 127; code++) {
      if (!inRange(code, sel)) continue;
      const cell = document.createElement('div');
      cell.className = 'ascii-cell';
      const ch = (code < 32 || code === 127) ? `\\x${code.toString(16).padStart(2,'0').toUpperCase()}` : (code === 32 ? '␣' : String.fromCharCode(code));
      const dec = code.toString(10);
      const hex = code.toString(16).toUpperCase().padStart(2,'0');
      const repr = (code < 32 || code === 127) ? `${hex}` : ch;
      const search = `${dec} ${hex} ${repr}`.toLowerCase();
      if (f && !search.includes(f)) continue;
      cell.innerHTML = `<div class="code">${dec} · ${hex}</div><div class="ch">${ch === ' ' ? '&nbsp;' : ch.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</div>`;
      cell.title = `点击复制十进制 ${dec}`;
      cell.addEventListener('click', () => window.copyText(String.fromCharCode(code).replace(/[\x00-\x1f]/g, ''), '已复制'));
      grid.appendChild(cell);
    }
  }

  rangeSel.addEventListener('change', render);
  filter.addEventListener('input', render);
  render();
})();
