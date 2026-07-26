/* base.js — shared utilities across all tool pages. */
(() => {
  'use strict';

  window.toast = function (msg, duration = 1400) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), duration);
  };

  window.copyText = async function (text, successMsg = '已复制') {
    if (text === '' || text === null || text === undefined) {
      toast('内容为空');
      return;
    }
    try {
      await navigator.clipboard.writeText(String(text));
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = String(text);
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      ta.remove();
    }
    toast(successMsg);
  };

  window.tryParseJson = function (s) {
    if (!s || !s.trim()) return null;
    let t = s.trim();
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      try {
        t = JSON.parse('"' + t.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\') + '"');
      } catch (_) {}
    }
    try { return JSON.parse(t); } catch (_) {}
    if (/^[{[]/.test(t) && !t.match(/[{,]\s*"[^"]+"\s*:/)) {
      const c = t.replace(/'/g, '"').replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
      try { return JSON.parse(c); } catch (_) {}
    }
    return null;
  };

  window.bigIntReplacer = function (_k, v) {
    if (typeof v === 'bigint') return v.toString();
    return v;
  };

  window.stringifyJson = function (value, indent = 2, bigIntAsString = true) {
    let s = JSON.stringify(value, bigIntReplacer, indent);
    if (bigIntAsString) {
      s = s.replace(/(?<=[\s,:[(])\d{16,}(?=[\s,)\]}])/g, (m) => `"${m}"`);
    }
    return s;
  };

  window.getQueryParam = function (name) {
    return new URLSearchParams(location.search).get(name);
  };

  // Find current tool config entry
  window.currentTool = function () {
    const here = location.pathname;
    const cfg = window.TOOLS_CONFIG || [];
    for (const g of cfg) {
      for (const it of g.items) {
        if (new URL(it.href, location.href).pathname === here) return { group: g, item: it };
      }
    }
    return null;
  };

  // Set page-title attribute used by shell
  window.setPageTitle = function (t) { document.title = `${t} · MyTools`; };
})();
