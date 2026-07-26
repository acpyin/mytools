/* app-shell.js — inject the collapsible sidebar and main wrapper. */
(() => {
  const here = location.pathname;
  const cfg = window.TOOLS_CONFIG || [];
  const resolvePath = href => new URL(href, location.href).pathname;
  const currentItem = cfg.flatMap(group => group.items).find(item => resolvePath(item.href) === here);
  const isHome = here.endsWith('/home/index.html') || here.endsWith('/index.html') && !currentItem;

  // Record last tool (only real tool pages, not the home page itself)
  if (!isHome && currentItem) {
    const recentHref = currentItem.href;
    try { localStorage.setItem('mytools.last', recentHref); } catch (_) {}
    try {
      const KEY = 'mytools.recent';
      let arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      arr = arr.filter(x => x !== recentHref);
      arr.unshift(recentHref);
      if (arr.length > 8) arr = arr.slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (_) {}
  }

  const SIDEBAR_KEY = 'mytools.sidebar.collapsed';
  const GROUP_KEY = 'mytools.sidebar.groups';
  let manualCollapsed = localStorage.getItem(SIDEBAR_KEY);
  let groupsState = {};
  try { groupsState = JSON.parse(localStorage.getItem(GROUP_KEY) || '{}'); } catch (_) {}

  // === Build sidebar ===
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar mytools-app-sidebar';
  sidebar.id = 'mytoolsSidebar';
  if (manualCollapsed === '1') sidebar.classList.add('collapsed');
  sidebar.innerHTML = `
    <div class="sidebar-head">
      <a href="../home/index.html" class="brand-mark" title="MyTools">M</a>
      <a href="../home/index.html" class="title">MyTools</a>
      <button class="toggle" id="sidebarToggle" type="button"
        title="收起侧栏" aria-label="收起侧栏" aria-expanded="true"
        aria-controls="sidebarBody">«</button>
    </div>
    <div class="sidebar-body" id="sidebarBody"></div>
    <div class="sidebar-foot">纯静态 · 数据不上传</div>
    <div class="sidebar-edge" id="sidebarEdge" title="展开侧栏">
      <button class="edge-expand" id="edgeExpandBtn" type="button"
        title="展开侧栏" aria-label="展开侧栏" aria-expanded="false"
        aria-controls="sidebarBody">»</button>
    </div>
  `;
  document.body.insertBefore(sidebar, document.body.firstChild);

  const body = sidebar.querySelector('#sidebarBody');
  cfg.forEach((g, gi) => {
    const gId = `g${gi}`;
    const wrap = document.createElement('div');
    wrap.className = 'group' + (groupsState[gId] === 1 ? ' collapsed' : '');
    wrap.dataset.gid = gId;
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'group-head';
    head.setAttribute('aria-expanded', String(!wrap.classList.contains('collapsed')));
    head.setAttribute('aria-controls', `${gId}-items`);
    head.innerHTML = `<span class="icon">${g.icon || '•'}</span><span>${g.name}</span><span class="caret">▼</span>`;
    head.addEventListener('click', () => {
      wrap.classList.toggle('collapsed');
      head.setAttribute('aria-expanded', String(!wrap.classList.contains('collapsed')));
      groupsState[gId] = wrap.classList.contains('collapsed') ? 1 : 0;
      try { localStorage.setItem(GROUP_KEY, JSON.stringify(groupsState)); } catch (_) {}
    });
    const gbody = document.createElement('div');
    gbody.className = 'group-body';
    gbody.id = `${gId}-items`;
    g.items.forEach(it => {
      const a = document.createElement('a');
      a.className = 'nav-item';
      a.href = it.href;
      a.title = it.desc || it.label;
      if (resolvePath(it.href) === here) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
      a.innerHTML = `<span class="ic">${(it.icon || it.label.charAt(0)).slice(0, 2)}</span><span>${it.label}</span>`;
      gbody.appendChild(a);
    });
    wrap.appendChild(head);
    wrap.appendChild(gbody);
    body.appendChild(wrap);
  });

  // === Build main wrapper around existing body content ===
  const skip = new Set([sidebar]);
  const moved = [];
  Array.from(document.body.children).forEach((el) => {
    if (skip.has(el)) return;
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK' || el.tagName === 'META') return;
    moved.push(el);
  });
  const main = document.createElement('div');
  main.className = 'main';
  const content = document.createElement('div');
  content.className = 'content';
  moved.forEach((el) => content.appendChild(el));
  main.appendChild(content);
  document.body.appendChild(main);

  // === Toggle behavior ===
  function setCollapsed(c) {
    sidebar.classList.toggle('collapsed', c);
    const toggle = sidebar.querySelector('#sidebarToggle');
    const edge = sidebar.querySelector('#edgeExpandBtn');
    toggle.setAttribute('aria-expanded', String(!c));
    toggle.setAttribute('aria-label', c ? '展开侧栏' : '收起侧栏');
    toggle.title = c ? '展开侧栏' : '收起侧栏';
    if (edge) edge.setAttribute('aria-expanded', String(!c));
    try { localStorage.setItem(SIDEBAR_KEY, c ? '1' : '0'); } catch (_) {}
  }
  setCollapsed(sidebar.classList.contains('collapsed'));
  sidebar.querySelector('#sidebarToggle').addEventListener('click', () => {
    setCollapsed(!sidebar.classList.contains('collapsed'));
  });
  const edgeExpand = sidebar.querySelector('#edgeExpandBtn');
  const sidebarEdge = sidebar.querySelector('#sidebarEdge');
  function expandFromEdge() { setCollapsed(false); }
  if (edgeExpand) edgeExpand.addEventListener('click', (e) => { e.stopPropagation(); expandFromEdge(); });
  if (sidebarEdge) sidebarEdge.addEventListener('click', expandFromEdge);
})();
