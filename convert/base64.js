(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');

  function setStatus(s, c='') { status.textContent = s; status.className = 'status-msg ' + c; }
  function updateMeta() {
    document.getElementById('leftMeta').textContent = `${left.value.length} 字符`;
    document.getElementById('rightMeta').textContent = `${right.value.length} 字符`;
  }

  function encode() {
    const s = left.value;
    const utf8 = document.getElementById('utf8Chk').checked;
    const urlSafe = document.getElementById('urlSafeChk').checked;
    try {
      let out = utf8 ? btoa(unescape(encodeURIComponent(s))) : btoa(s);
      if (urlSafe) {
        out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      right.value = out;
      updateMeta();
      setStatus('✓ 已编码', 'ok');
    } catch (e) { setStatus('编码失败：' + e.message, 'err'); }
  }

  function decode() {
    let s = left.value.trim();
    const utf8 = document.getElementById('utf8Chk').checked;
    const urlSafe = document.getElementById('urlSafeChk').checked;
    try {
      if (urlSafe) {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
      }
      const out = utf8 ? decodeURIComponent(escape(atob(s))) : atob(s);
      right.value = out;
      updateMeta();
      setStatus('✓ 已解码', 'ok');
    } catch (e) {
      setStatus('解码失败：' + e.message, 'err');
    }
  }

  function init() {
    document.getElementById('encodeBtn').addEventListener('click', encode);
    document.getElementById('decodeBtn').addEventListener('click', decode);
    document.getElementById('swapBtn').addEventListener('click', () => { const t = left.value; left.value = right.value; right.value = t; updateMeta(); });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value = ''; right.value = ''; updateMeta(); setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value = 'MyTools · 在线开发者工具集 — JSON、URL、Base64、Hash 等'; encode(); });
    [left, right].forEach(el => el.addEventListener('input', updateMeta));
    left.value = 'Hello, MyTools! 你好，世界！';
    encode();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
