(() => {
  const json = document.getElementById('json');
  const jp = document.getElementById('jp');
  const out = document.getElementById('out');
  const status = document.getElementById('status');
  const setStatus = (s, c = '') => { status.textContent = s; status.className = 'status-msg ' + c; };

  function lookup(obj, expr) {
    if (expr === '$') return [obj];
    if (!expr) return [obj];
    let results = [obj];
    const segments = parseExpr(expr);
    for (const seg of segments) {
      const next = [];
      for (const v of results) next.push(...evalSeg(v, seg));
      results = next;
      if (!results.length) break;
    }
    return results;
  }

  function parseExpr(expr) {
    const segs = [];
    let i = 0;
    const s = expr.startsWith('$') ? expr.slice(1) : expr;
    let buf = '';
    while (i < s.length) {
      const c = s[i];
      if (c === '.') {
        if (s[i + 1] === '.') {
          if (buf) { segs.push({ type: 'key', value: buf }); buf = ''; }
          segs.push({ type: 'desc' }); i += 2;
          let name = '';
          while (i < s.length && s[i] !== '.' && s[i] !== '[') { name += s[i]; i++; }
          if (name) segs.push({ type: 'key', value: name });
          continue;
        } else {
          if (buf) { segs.push({ type: 'key', value: buf }); buf = ''; }
          i++;
          let name = '';
          while (i < s.length && s[i] !== '.' && s[i] !== '[') { name += s[i]; i++; }
          if (name) segs.push({ type: 'key', value: name });
          continue;
        }
      } else if (c === '[') {
        if (buf) { segs.push({ type: 'key', value: buf }); buf = ''; }
        const end = s.indexOf(']', i);
        if (end === -1) throw new Error(`位置 ${i + 1} 缺少右方括号 ]`);
        const inside = s.slice(i + 1, end);
        if (!inside.trim()) throw new Error(`位置 ${i + 1} 的方括号不能为空`);
        segs.push({ type: 'bracket', value: inside });
        i = end + 1;
        continue;
      } else { buf += c; i++; }
    }
    if (buf) segs.push({ type: 'key', value: buf });
    return segs;
  }

  function evalSeg(v, seg) {
    if (v === null || v === undefined) return [];
    if (seg.type === 'key') {
      if (typeof v !== 'object') return [];
      const out = v[seg.value];
      return out === undefined ? [] : [out];
    }
    if (seg.type === 'desc') {
      const out = [];
      function walk(o) {
        if (o === null) return;
        if (Array.isArray(o)) { o.forEach(walk); return; }
        if (typeof o === 'object') {
          for (const k of Object.keys(o)) {
            out.push(o[k]);
            walk(o[k]);
          }
        }
      }
      walk(v);
      return out;
    }
    if (seg.type === 'bracket') {
      const inner = seg.value;
      if (inner === '*') {
        if (Array.isArray(v)) return v;
        if (typeof v === 'object') return Object.values(v);
        return [];
      }
      const idx = parseInt(inner, 10);
      if (/^-?\d+$/.test(inner) && !isNaN(idx)) {
        if (Array.isArray(v)) {
          const item = v[idx >= 0 ? idx : v.length + idx];
          return item === undefined ? [] : [item];
        }
        return [];
      }
      if (inner.includes(':')) {
        const [s, e] = inner.split(':').map(x => x === '' ? null : parseInt(x, 10));
        if (Array.isArray(v)) return v.slice(s ?? 0, e ?? v.length);
        return [];
      }
      if (inner.startsWith('?')) return [];
      return [];
    }
    return [];
  }

  let lastResults = [];

  function run() {
    let obj;
    try { obj = JSON.parse(json.value); } catch (e) { setStatus('JSON 解析失败：' + e.message, 'err'); return; }
    try {
      const expr = jp.value.trim();
      const results = lookup(obj, expr);
      lastResults = results;
      if (!results.length) { out.textContent = '(空)'; setStatus('无匹配', 'err'); return; }
      out.textContent = results.map(r => typeof r === 'string' ? '"' + r + '"' : JSON.stringify(r, null, 2)).join('\n----\n');
      setStatus(`✓ ${results.length} 项`, 'ok');
    } catch (e) { setStatus('JSONPath 错误：' + e.message, 'err'); }
  }

  function copyAll() {
    if (!lastResults.length) { window.toast('内容为空'); return; }
    const text = lastResults.map(r => typeof r === 'string' ? '"' + r + '"' : JSON.stringify(r, null, 2)).join('\n----\n');
    window.copyText(text, '已复制');
  }

  function init() {
    const jsonEd = window.JsonEditor.upgrade(json, { mode: 'application/json' });

    document.getElementById('runBtn').addEventListener('click', run);
    document.getElementById('copyAll').addEventListener('click', copyAll);
    document.getElementById('clearBtn').addEventListener('click', () => { json.value = ''; out.textContent = '—'; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      json.value = JSON.stringify({ store: { book: [{ title: 'A' }, { title: 'B' }], pen: 5 }, name: 'shop' }, null, 2);
      jp.value = '$.store.book[*].title';
      run();
    });
    document.getElementById('foldBtn').addEventListener('click', () => jsonEd && jsonEd.foldAll());
    document.getElementById('unfoldBtn').addEventListener('click', () => jsonEd && jsonEd.unfoldAll());

    json.value = JSON.stringify({ store: { book: [{ title: 'A' }, { title: 'B' }], pen: 5 }, name: 'shop' }, null, 2);
    jp.value = '$.store.book[*].title';
    run();

    setTimeout(() => jsonEd.refresh(), 0);
    window.addEventListener('resize', () => jsonEd.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();