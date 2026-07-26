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
    try {
      let out = encodeURIComponent(s);
      if (document.getElementById('plusChk').checked) {
        out = out.replace(/%20/g, '+');
      }
      if (!document.getElementById('upperChk').checked) {
        out = out.replace(/%[0-9A-F]{2}/g, m => m.toLowerCase());
      }
      right.value = out;
      updateMeta();
      setStatus('✓ 已编码', 'ok');
    } catch (e) { setStatus('失败：' + e.message, 'err'); }
  }

  function decode() {
    let s = left.value;
    try {
      if (document.getElementById('plusChk').checked) {
        s = s.replace(/\+/g, '%20');
      }
      right.value = decodeURIComponent(s);
      updateMeta();
      setStatus('✓ 已解码', 'ok');
    } catch (e) {
      setStatus('解码失败：' + e.message, 'err');
    }
  }

  function init() {
    document.getElementById('encodeBtn').addEventListener('click', encode);
    document.getElementById('decodeBtn').addEventListener('click', decode);
    document.getElementById('swapBtn').addEventListener('click', () => {
      const t = left.value; left.value = right.value; right.value = t; updateMeta();
    });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value = ''; right.value = ''; updateMeta(); setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      left.value = 'https://mytools.dev/?q=JSON 对比 & name=MyTools';
      encode();
    });
    left.addEventListener('input', updateMeta);
    right.addEventListener('input', updateMeta);
    left.value = 'MyTools · JSON 对比 / 格式化 / URL 编码';
    encode();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
