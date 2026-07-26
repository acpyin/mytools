(() => {
  const text = document.getElementById('text');
  const format = document.getElementById('format');
  const textChk = document.getElementById('textChk');
  const bc = document.getElementById('bc');

  function render() {
    bc.innerHTML = '<svg></svg>';
    try {
      JsBarcode(bc.querySelector('svg'), text.value, {
        format: format.value,
        displayValue: textChk.checked,
        lineColor: '#000',
        background: '#ffffff',
        margin: 8,
      });
    } catch (e) { bc.innerHTML = '<div style="color:var(--del);">' + e.message + '</div>'; }
  }
  function init() {
    text.addEventListener('input', render);
    format.addEventListener('change', render);
    textChk.addEventListener('change', render);
    render();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();