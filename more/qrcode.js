(() => {
  const text = document.getElementById('text');
  const size = document.getElementById('size');
  const fg = document.getElementById('fg');
  const bg = document.getElementById('bg');
  const qr = document.getElementById('qr');
  let qrious = null;

  function render() {
    if (!window.QRious) return;
    qrious = new QRious({ element: qr, value: text.value || ' ', size: parseInt(size.value, 10), foreground: fg.value, background: bg.value, level: 'H' });
  }
  function init() {
    text.addEventListener('input', render);
    size.addEventListener('change', render);
    fg.addEventListener('input', render);
    bg.addEventListener('input', render);
    render();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
