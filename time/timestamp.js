(() => {
  const $ = id => document.getElementById(id);
  const status = $('status');
  const setStatus = (text, type = '') => {
    status.textContent = text;
    status.className = `status-msg ${type}`;
  };
  const pad = (value, size = 2) => String(value).padStart(size, '0');
  function formatLocal(date, milliseconds = false) {
    const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return milliseconds ? `${base}.${pad(date.getMilliseconds(), 3)}` : base;
  }
  function validInteger(value, digits) {
    const text = value.trim();
    if (!new RegExp(`^-?\\d{${digits}}$`).test(text)) return null;
    const number = Number(text);
    return Number.isSafeInteger(number) ? number : null;
  }
  function convertTimestamp(unit) {
    const seconds = unit === 'sec';
    const input = $(seconds ? 'secInput' : 'msInput');
    const value = validInteger(input.value, seconds ? 10 : 13);
    if (value === null) {
      setStatus(`请输入有效的${seconds ? '10 位秒级' : '13 位毫秒级'}时间戳`, 'err');
      input.focus();
      return;
    }
    const date = new Date(seconds ? value * 1000 : value);
    if (Number.isNaN(date.getTime())) {
      setStatus('时间戳超出有效日期范围', 'err');
      return;
    }
    $(`${unit}DateLocal`).textContent = formatLocal(date, !seconds);
    $(`${unit}DateUtc`).textContent = date.toISOString();
    setStatus(`✓ 已转换${seconds ? '10 位' : '13 位'}时间戳`, 'ok');
  }
  function convertDate() {
    if (!$('dtInput').value) {
      setStatus('请选择日期', 'err');
      return;
    }
    const date = new Date($('dtInput').value);
    if (Number.isNaN(date.getTime())) {
      setStatus('无效日期', 'err');
      return;
    }
    $('secResult').textContent = Math.floor(date.getTime() / 1000);
    $('msResult').textContent = date.getTime();
    setStatus('✓ 已同时生成 10 位和 13 位时间戳', 'ok');
  }
  function setDateNow() {
    const date = new Date();
    $('dtInput').value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  function tick() {
    const now = Date.now();
    $('nowTime').textContent = formatLocal(new Date(now), true);
    $('nowSec').textContent = Math.floor(now / 1000);
    $('nowMs').textContent = now;
  }
  function useCurrent(unit) {
    $(unit === 'sec' ? 'secInput' : 'msInput').value = unit === 'sec' ? Math.floor(Date.now() / 1000) : Date.now();
    convertTimestamp(unit);
  }
  function copy(id, message) {
    const value = $(id).textContent;
    if (value && value !== '—') window.copyText(value, message);
  }
  function init() {
    tick();
    setInterval(tick, 1000);
    $('secToDate').addEventListener('click', () => convertTimestamp('sec'));
    $('msToDate').addEventListener('click', () => convertTimestamp('ms'));
    $('secNowBtn').addEventListener('click', () => useCurrent('sec'));
    $('msNowBtn').addEventListener('click', () => useCurrent('ms'));
    $('dtToTs').addEventListener('click', convertDate);
    $('dtNow').addEventListener('click', () => { setDateNow(); convertDate(); });
    $('copyNowSec').addEventListener('click', () => copy('nowSec', '10 位时间戳已复制'));
    $('copyNowMs').addEventListener('click', () => copy('nowMs', '13 位时间戳已复制'));
    $('copySecDate').addEventListener('click', () => copy('secDateLocal', '日期已复制'));
    $('copyMsDate').addEventListener('click', () => copy('msDateLocal', '日期已复制'));
    $('copySec').addEventListener('click', () => copy('secResult', '10 位时间戳已复制'));
    $('copyMs').addEventListener('click', () => copy('msResult', '13 位时间戳已复制'));
    $('secInput').addEventListener('keydown', event => { if (event.key === 'Enter') convertTimestamp('sec'); });
    $('msInput').addEventListener('keydown', event => { if (event.key === 'Enter') convertTimestamp('ms'); });
    $('dtInput').addEventListener('keydown', event => { if (event.key === 'Enter') convertDate(); });

    const now = Date.now();
    $('secInput').value = Math.floor(now / 1000);
    $('msInput').value = now;
    convertTimestamp('sec');
    convertTimestamp('ms');
    setDateNow();
    convertDate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
