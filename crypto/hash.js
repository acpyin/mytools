(() => {
  const input = document.getElementById('input');
  const results = document.getElementById('hashResults');
  const status = document.getElementById('status');
  const setStatus = (s, c='') => { status.textContent=s; status.className='status-msg '+c; };
  const algoSel = window.getQueryParam('alg') || 'all';

  function makeRow(name, value) {
    const row = document.createElement('div');
    row.className = 'hash-row';
    const up = document.getElementById('upperChk').checked;
    row.innerHTML = `
      <div class="label">${name}</div>
      <div class="value" data-val="${value}">${up ? value.toUpperCase() : value}</div>
      <div class="actions">
        <button class="btn" data-copy>复制</button>
      </div>`;
    results.appendChild(row);
  }

  async function compute() {
    const text = input.value;
    results.innerHTML = '';
    if (!text) { setStatus('请输入文本'); return; }
    try {
      const want = (k) => algoSel === 'all' || algoSel === k;
      if (want('md5')) {
        const md5 = md5Js.md5(text);
        makeRow('MD5', md5);
      }
      const enc = new TextEncoder().encode(text);
      const algs = [
        ['SHA-1',   'SHA-1',   'sha1'],
        ['SHA-256', 'SHA-256', 'sha256'],
        ['SHA-384', 'SHA-384', 'sha384'],
        ['SHA-512', 'SHA-512', 'sha512'],
      ];
      for (const [name, alg, key] of algs) {
        if (!want(key)) continue;
        try {
          const buf = await crypto.subtle.digest(alg, enc);
          const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
          makeRow(name, hex);
        } catch (e) {
          makeRow(name, '(不支持)');
        }
      }
      setStatus('✓ 计算完成', 'ok');
    } catch (e) {
      setStatus('计算失败：' + e.message, 'err');
    }
  }

  function init() {
    input.addEventListener('input', compute);
    document.getElementById('upperChk').addEventListener('change', compute);
    document.getElementById('clearBtn').addEventListener('click', () => { input.value=''; results.innerHTML=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { input.value='MyTools'; compute(); });
    results.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-copy]');
      if (!btn) return;
      const val = btn.parentElement.previousElementSibling.dataset.val;
      window.copyText(val, '已复制');
    });
    input.value='MyTools';
    compute();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
