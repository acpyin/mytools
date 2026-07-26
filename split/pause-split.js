(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function splitPunct(s) {
    return s.split(/[。！？!?；;\n]+/).map(x => x.trim()).filter(Boolean);
  }
  function init() {
    function go() {
      const items = splitPunct(left.value);
      right.value = items.join('\n');
      setStatus(`✓ ${items.length} 句`, 'ok');
    }
    document.getElementById('splitBtn').addEventListener('click', go);
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='这是第一句。这是第二句！这是第三句？\n新一行开始。'; go(); });
    left.value='这是第一句。这是第二句！这是第三句？';
    go();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
