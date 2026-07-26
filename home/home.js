(() => {
  const LAST_KEY = 'mytools.last';
  const RECENT_KEY = 'mytools.recent';
  const MAX_RECENT = 8;

  function pushRecent(href) {
    if (!href || href === '/home/index.html') return;
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (_) {}
    arr = arr.filter(x => x !== href);
    arr.unshift(href);
    if (arr.length > MAX_RECENT) arr = arr.slice(0, MAX_RECENT);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(arr)); } catch (_) {}
  }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (_) { return []; }
  }

  function findTool(href) {
    const cfg = window.TOOLS_CONFIG || [];
    for (const g of cfg) {
      for (const it of g.items) {
        if (it.href === href) return { group: g, item: it };
      }
    }
    return null;
  }

  // === Render all categories ===
  const grid = document.getElementById('categoriesGrid');
  if (grid && window.TOOLS_CONFIG) {
    window.TOOLS_CONFIG.forEach((g) => {
      const sec = document.createElement('section');
      sec.className = 'cat-section';
      sec.innerHTML = `<h2>${g.icon || '•'} ${g.name}</h2><div class="tool-grid"></div>`;
      const tg = sec.querySelector('.tool-grid');
      g.items.forEach((it) => {
        const a = document.createElement('a');
        a.className = 'tool-card';
        a.href = it.href;
        a.innerHTML = `
          <div class="icon">${(it.icon || it.label.charAt(0)).slice(0, 2)}</div>
          <div class="name">${it.label}</div>
          <div class="desc">${it.desc || ''}</div>
        `;
        tg.appendChild(a);
      });
      grid.appendChild(sec);
    });
  }

  // === Render recent section ===
  const recentSection = document.getElementById('recentSection');
  const recentGrid = document.getElementById('recentGrid');
  const recent = getRecent();
  if (recent.length) {
    recentSection.style.display = '';
    recent.forEach((href) => {
      const found = findTool(href);
      if (!found) return;
      const a = document.createElement('a');
      a.className = 'tool-card';
      a.href = href;
      a.title = found.item.desc || '';
      a.innerHTML = `
        <div class="icon">${(found.item.icon || found.item.label.charAt(0)).slice(0, 2)}</div>
        <div class="name">${found.item.label}</div>
        <div class="desc">${found.group.name}</div>
      `;
      recentGrid.appendChild(a);
    });
    document.getElementById('clearRecentBtn').addEventListener('click', () => {
      try { localStorage.removeItem(RECENT_KEY); localStorage.removeItem(LAST_KEY); } catch (_) {}
      location.reload();
    });
  }

  window.pushRecent = pushRecent;
})();
