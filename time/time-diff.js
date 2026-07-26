(() => {
  const t1 = document.getElementById('t1');
  const t2 = document.getElementById('t2');
  const diff = document.getElementById('diff');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function pad(n) { return String(n).padStart(2, '0'); }
  function setNow(input) {
    const d = new Date();
    input.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function compute() {
    if (!t1.value || !t2.value) { setStatus('请输入两个时间', 'err'); return; }
    const a = new Date(t1.value);
    const b = new Date(t2.value);
    const ms = b - a;
    const abs = Math.abs(ms);
    const sec = Math.floor(abs / 1000);
    const day = Math.floor(sec / 86400);
    const hour = Math.floor((sec % 86400) / 3600);
    const min = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const sign = ms >= 0 ? '后' : '前';
    diff.textContent = `${b.toLocaleString()} ${ms >= 0 ? '在' : '在'} ${a.toLocaleString()} ${sign} ${day} 天 ${hour} 时 ${min} 分 ${s} 秒（共 ${(abs / 1000).toFixed(2)} 秒 / ${(abs/60000).toFixed(2)} 分 / ${(abs/86400000).toFixed(4)} 天）`;
    setStatus('✓', 'ok');
  }
  function init() {
    document.getElementById('now1').addEventListener('click', () => { setNow(t1); compute(); });
    document.getElementById('now2').addEventListener('click', () => { setNow(t2); compute(); });
    t1.addEventListener('change', compute);
    t2.addEventListener('change', compute);
    setNow(t1);
    setNow(t2);
    compute();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
