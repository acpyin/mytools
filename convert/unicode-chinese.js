(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function encode() {
    const prefix = document.getElementById('prefixChk').checked;
    const space = document.getElementById('spaceChk').checked;
    const sep = space ? ' ' : '';
    const pre = prefix ? '\\u' : '';
    let out = '';
    for (const ch of left.value) {
      const code = ch.codePointAt(0);
      if (code > 127) {
        out += pre + code.toString(16).padStart(4, '0') + sep;
      } else out += ch;
    }
    right.value = out.trim();
    setStatus('✓ 已编码', 'ok');
  }
  function decode() {
    try {
      const s = left.value.replace(/\\u([0-9a-fA-F]{2,6})/g, (m, h) => String.fromCodePoint(parseInt(h, 16)));
      right.value = s;
      setStatus('✓ 已解码', 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function init() {
    document.getElementById('encodeBtn').addEventListener('click', encode);
    document.getElementById('decodeBtn').addEventListener('click', decode);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value,'已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='你好，世界！'; encode(); });
    left.value='你好，世界！';
    encode();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
