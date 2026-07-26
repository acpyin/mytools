(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');

  function camelToUnder(s) {
    return s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }
  function underToCamel(s) {
    return s.replace(/[_-](.)/g, (_, c) => c.toUpperCase());
  }

  function init() {
    document.getElementById('camelBtn').addEventListener('click', () => { right.value = camelToUnder(left.value); });
    document.getElementById('underBtn').addEventListener('click', () => { right.value = underToCamel(left.value); });
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='userId user_name firstName'; camelToUnder; });
    left.value='userId user_name firstName First_Name';
    right.value=camelToUnder(left.value);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
