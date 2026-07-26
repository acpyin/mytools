(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };

  function init() {
    document.getElementById('padBtn').addEventListener('click', () => {
      const w = parseInt(document.getElementById('width').value, 10);
      const ch = (document.getElementById('padChar').value || '0').slice(0, 1);
      const keepSign = document.getElementById('keepSignChk').checked;
      right.value = left.value.split('\n').map(line => {
        const trimmed = line.trim();
        let prefix = '';
        let rest = trimmed;
        if (keepSign && rest.startsWith('-')) { prefix = '-'; rest = rest.slice(1); }
        // don't pad non-numeric lines
        if (!/^\d+(\.\d+)?$/.test(rest)) return line;
        const [intPart, dec] = rest.split('.');
        let padded = intPart;
        if (padded.length < w) padded = ch.repeat(w - padded.length) + padded;
        return prefix + padded + (dec !== undefined ? '.' + dec : '');
      }).join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('rmPadBtn').addEventListener('click', () => {
      const re = /^(0+)(\d)/;
      right.value = left.value.split('\n').map(line => {
        const trimmed = line.trim();
        if (!/^[+-]?\d+$/.test(trimmed)) return line;
        return trimmed.replace(re, '$2').replace(/^(\+)/, '');
      }).join('\n');
      setStatus('✓', 'ok');
    });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='1\n23\n456\n7890'; document.getElementById('padBtn').click(); });
    left.value='1\n23\n456\n7890';
    document.getElementById('padBtn').click();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
