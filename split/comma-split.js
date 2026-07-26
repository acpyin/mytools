(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function split(s) {
    return s.split(',').map(x => x.trim()).filter(Boolean);
  }

  function init() {
    function format() {
      const items = split(left.value);
      right.value = items.join('\n');
      setStatus(`✓ ${items.length} 项`, 'ok');
    }
    function join() {
      right.value = left.value.split('\n').map(x => x.trim()).filter(Boolean).join(',');
      setStatus('✓ 已合并', 'ok');
    }
    document.getElementById('splitBtn').addEventListener('click', format);
    document.getElementById('joinBtn').addEventListener('click', join);
    document.getElementById('sortBtn').addEventListener('click', () => { right.value = split(left.value).sort().join('\n'); });
    document.getElementById('uniqueBtn').addEventListener('click', () => { right.value = [...new Set(split(left.value))].join('\n'); });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='apple,banana,orange,apple'; format(); });
    left.value='apple,banana,orange,apple,grape';
    format();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
