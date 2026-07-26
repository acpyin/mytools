(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function split() {
    let pat = document.getElementById('pattern').value;
    if (!pat) { setStatus('请输入分隔符', 'err'); return; }
    try {
      const re = new RegExp(pat);
      let items = left.value.split(re);
      if (document.getElementById('trimChk').checked) items = items.map(s => s.trim());
      if (document.getElementById('skipEmptyChk').checked) items = items.filter(Boolean);
      right.value = items.join('\n');
      setStatus(`✓ ${items.length} 项`, 'ok');
    } catch (e) { setStatus('正则错误：'+e.message, 'err'); }
  }
  function join() {
    const sep = document.getElementById('joinWith').value || '\n';
    right.value = left.value.split('\n').filter(Boolean).join(sep === '\\n' ? '\n' : sep);
    setStatus('✓ 已合并', 'ok');
  }
  function init() {
    document.getElementById('splitBtn').addEventListener('click', split);
    document.getElementById('joinBtn').addEventListener('click', join);
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='a;b|c d,e'; split(); });
    left.value='a;b|c d,e';
    split();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
