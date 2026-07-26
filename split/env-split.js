(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function parseEnv(s) {
    const out = {};
    s.split(/\r?\n/).forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const eq = line.indexOf('=');
      if (eq < 0) return;
      let k = line.slice(0, eq).trim();
      let v = line.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      out[k] = v;
    });
    return out;
  }

  function toJSON() {
    try {
      const o = parseEnv(left.value);
      right.value = JSON.stringify(o, null, 2);
      setStatus(`✓ ${Object.keys(o).length} 项`, 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function toTable() {
    const o = parseEnv(left.value);
    right.value = Object.entries(o).map(([k,v]) => `${k.padEnd(20)} = ${v}`).join('\n');
    setStatus(`✓ ${Object.keys(o).length} 项`, 'ok');
  }
  function toEnv() {
    try {
      const o = JSON.parse(left.value);
      right.value = Object.entries(o).map(([k, v]) => `${k}=${typeof v === 'string' && /\s/.test(v) ? `"${v}"` : v}`).join('\n');
      setStatus('✓ 已生成', 'ok');
    } catch (e) { setStatus('不是 JSON: '+e.message, 'err'); }
  }

  function init() {
    document.getElementById('jsonBtn').addEventListener('click', toJSON);
    document.getElementById('tableBtn').addEventListener('click', toTable);
    document.getElementById('envBtn').addEventListener('click', toEnv);
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='# 注释\nDB_HOST=localhost\nDB_PORT=3306\nAPP_NAME="My App"\nDEBUG=true'; toJSON(); });
    left.value='DB_HOST=localhost\nDB_PORT=3306\nAPP_NAME="My App"\nDEBUG=true';
    toJSON();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
