(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.createElement('div');
  status.className = 'status-msg';
  document.querySelector('.toolbar').insertAdjacentElement('afterend', status);
  const setStatus = (text, type = '') => {
    status.textContent = text;
    status.className = `status-msg ${type}`;
  };
  function go() {
    const pinyin = window.pinyinPro && window.pinyinPro.pinyin;
    if (typeof pinyin !== 'function') {
      right.value = '';
      setStatus('拼音组件加载失败，请刷新页面重试', 'err');
      return;
    }
    const opts = {
      pattern: document.getElementById('pattern').value,
      toneType: document.getElementById('toneType').value,
      nonZh: document.getElementById('nonZhChk').checked ? 'consecutive' : 'removed',
      v: document.getElementById('vChk').checked,
      separator: document.getElementById('sep').value,
      mode: document.getElementById('surnameChk').checked ? 'surname' : 'normal',
      type: 'string',
    };
    try {
      right.value = pinyin(left.value, opts);
      setStatus(document.getElementById('surnameChk').checked ? '✓ 已按姓氏读音转换' : '✓ 转换完成', 'ok');
    } catch (e) {
      right.value = '';
      setStatus(`转换失败：${e.message}`, 'err');
    }
  }
  function init() {
    document.getElementById('convertBtn').addEventListener('click', go);
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      document.getElementById('surnameChk').checked = false;
      left.value='你好世界，这是 MyTools 拼音工具。';
      go();
    });
    document.getElementById('surnameSampleBtn').addEventListener('click', () => {
      document.getElementById('surnameChk').checked = true;
      left.value='曾乐、单田芳、区楚良、尉迟恭';
      go();
    });
    ['pattern', 'toneType', 'surnameChk', 'nonZhChk', 'vChk'].forEach(id => {
      document.getElementById(id).addEventListener('change', go);
    });
    document.getElementById('sep').addEventListener('input', go);
    left.addEventListener('input', go);
    left.value='你好世界，MyTools 拼音工具';
    go();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
