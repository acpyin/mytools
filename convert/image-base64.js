(() => {
  const drop = document.getElementById('drop');
  const fileIn = document.getElementById('fileIn');
  const preview = document.getElementById('preview');
  const out = document.getElementById('out');
  const fmt = document.getElementById('fmt');
  const q = document.getElementById('q');

  function handle(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      preview.src = dataUrl;
      preview.style.display = 'block';
      out.value = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function convertFormat() {
    if (!preview.src) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      out.value = c.toDataURL(fmt.value, parseFloat(q.value));
    };
    img.src = preview.src;
  }

  function init() {
    drop.addEventListener('click', () => fileIn.click());
    fileIn.addEventListener('change', e => handle(e.target.files[0]));
    ['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => { e.preventDefault(); handle(e.dataTransfer.files[0]); });
    fmt.addEventListener('change', convertFormat);
    q.addEventListener('change', convertFormat);
    document.getElementById('clearBtn').addEventListener('click', () => { out.value=''; preview.style.display='none'; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(out.value, '已复制'));
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
