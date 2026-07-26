(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');

  function splitWords(s) {
    return String(s).trim().split(/[\s_\-]+|(?=[A-Z])|(?<=[a-z])(?=[A-Z])/).filter(Boolean);
  }
  function set(s) { right.value = s; window.toast('✓'); }

  function lower() { set(left.value.toLowerCase()); }
  function upper() { set(left.value.toUpperCase()); }
  function title() {
    set(left.value.replace(/\b\w/g, c => c.toUpperCase()));
  }
  function camel() {
    const w = splitWords(left.value);
    set((w[0]||'').toLowerCase() + w.slice(1).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(''));
  }
  function pascal() {
    const w = splitWords(left.value);
    set(w.map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(''));
  }
  function snake() { set(splitWords(left.value).map(x => x.toLowerCase()).join('_')); }
  function kebab() { set(splitWords(left.value).map(x => x.toLowerCase()).join('-')); }
  function constant() { set(splitWords(left.value).map(x => x.toUpperCase()).join('_')); }

  function init() {
    [['lowerBtn', lower], ['upperBtn', upper], ['titleBtn', title], ['camelBtn', camel],
     ['pascalBtn', pascal], ['snakeBtn', snake], ['kebabBtn', kebab], ['constBtn', constant]].forEach(([id, fn]) => document.getElementById(id).addEventListener('click', fn));
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='hello world FOO_bar baz'; camel(); });
    left.value='hello world FOO_bar baz';
    camel();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
