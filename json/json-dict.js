(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function jsonToDict(s) {
    return s.replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None');
  }
  function dictToJson(s) {
    return s.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  }

  function toDict() {
    try { JSON.parse(left.value); right.value = jsonToDict(left.value); setStatus('✓', 'ok'); }
    catch (e) { setStatus('不是 JSON: '+e.message, 'err'); }
  }
  function toJSON() {
    try {
      let v = dictToJson(left.value);
      const p = JSON.parse(v);
      right.value = JSON.stringify(p, null, 2);
      setStatus('✓', 'ok');
    } catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function init() {
    document.getElementById('jsonToDictBtn').addEventListener('click', toDict);
    document.getElementById('dictToJsonBtn').addEventListener('click', toJSON);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value,'已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='{"a":1,"b":true,"c":null}'; toDict(); });
    left.value='{"a":1,"b":true,"c":null}';
    toDict();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
