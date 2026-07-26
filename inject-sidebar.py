#!/usr/bin/env python3
"""Inject sidebar + topbar HTML directly into all tool pages so they render
properly in IDE file preview as well as real browsers."""
import os
import re
import json

ROOT = os.path.dirname(os.path.abspath(__file__))

# Parse TOOLS_CONFIG from shared/tools-config.js
# Convert JS array-of-objects to Python via eval-safe approach
with open(os.path.join(ROOT, 'shared', 'tools-config.js'), 'r', encoding='utf-8') as f:
    cfg_src = f.read()

# Extract array literal between [ and last ];
start = cfg_src.find('[')
end = cfg_src.rfind(']') + 1
cfg_text = cfg_src[start:end]

# Use a tiny JS-style → JSON-ish transform
def parse_js_array(text):
    import re as _re
    # Run as JS via node — handles all quoting/escapes correctly
    import subprocess
    code = f'process.stdout.write(JSON.stringify({text}));'
    result = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr)
    return json.loads(result.stdout)

GROUPS = parse_js_array(cfg_text)


def escape_html(s):
    return (s.replace('&', '&amp;')
             .replace('<', '&lt;')
             .replace('>', '&gt;')
             .replace('"', '&quot;'))


def build_sidebar_html():
    groups_html = []
    for gi, g in enumerate(GROUPS):
        gid = f'g{gi}'
        icon = escape_html(g.get('icon') or '•')
        name = escape_html(g.get('name') or '')
        items_html = []
        for it in g.get('items', []):
            ic = (it.get('icon') or it.get('label', '').strip()[:1] or '·').strip()[:2]
            ic = escape_html(ic)
            label = escape_html(it.get('label') or '')
            items_html.append(
                f'<a class="nav-item" href="{escape_html(it["href"])}" title="{escape_html(it.get("desc",""))}">'
                f'<span class="ic">{ic}</span><span>{label}</span></a>'
            )
        groups_html.append(
            f'<div class="group" data-gid="{gid}">'
            f'<div class="group-head"><span class="icon">{icon}</span><span>{name}</span><span class="caret">▼</span></div>'
            f'<div class="group-body">{"".join(items_html)}</div>'
            f'</div>'
        )
    return (
        '<aside class="sidebar" id="mytoolsSidebar">\n'
        '  <div class="sidebar-head">\n'
        '    <a href="index.html" class="brand-mark" title="MyTools">M</a>\n'
        '    <span class="title">MyTools</span>\n'
        '    <button class="toggle" id="sidebarToggle" title="折叠/展开">⇤</button>\n'
        '  </div>\n'
        '  <div class="sidebar-body">' + ''.join(groups_html) + '</div>\n'
        '  <div class="sidebar-foot">纯静态 · 数据不上传</div>\n'
        '  <div class="sidebar-edge" id="sidebarEdge" title="展开侧栏">\n'
        '    <button class="edge-expand" id="edgeExpandBtn">» 菜单</button>\n'
        '    <span class="edge-tip">展开</span>\n'
        '  </div>\n'
        '</aside>'
    )


def inject_into_page(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Skip if sidebar already injected
    if 'id="mytoolsSidebar"' in html:
        return False

    sidebar_html = build_sidebar_html()
    body_match = re.search(r'<body[^>]*>', html)
    if not body_match:
        return False
    insert_at = body_match.end()
    new_html = html[:insert_at] + '\n' + sidebar_html + '\n' + html[insert_at:]
    # Update body to flex row
    new_html = new_html.replace('<body>', '<body class="has-sidebar">', 1)
    # Ensure app-shell.js is referenced if not already
    if 'app-shell.js' not in new_html:
        new_html = new_html.replace('</body>', '  <script src="../shared/app-shell.js"></script>\n</body>', 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    return True


def main():
    # Inject into all pages in menu category directories.
    n = 0
    categories = ('home', 'compare', 'json', 'format', 'convert', 'split',
                  'text', 'number', 'crypto', 'time', 'more')
    for category in categories:
        category_dir = os.path.join(ROOT, category)
        for fname in os.listdir(category_dir):
            if not fname.endswith('.html'):
                continue
            path = os.path.join(category_dir, fname)
            if inject_into_page(path):
                n += 1
                print(f'injected: {category}/{fname}')
    print(f'Total: {n} pages updated')


if __name__ == '__main__':
    main()
