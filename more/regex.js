(() => {
  const pattern = document.getElementById('pattern');
  const text = document.getElementById('text');
  const high = document.getElementById('highlight');
  const matchCount = document.getElementById('matchCount');
  const groupsStat = document.getElementById('groupsStat');
  const errStat = document.getElementById('errStat');
  const MAX_MATCHES = 5000;
  const TIMEOUT_MS = 300;
  let worker = null;
  let requestId = 0;
  let debounceTimer = null;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getFlags() {
    let f = '';
    if (document.getElementById('gFlag').checked) f += 'g';
    if (document.getElementById('iFlag').checked) f += 'i';
    if (document.getElementById('mFlag').checked) f += 'm';
    if (document.getElementById('sFlag').checked) f += 's';
    if (!f) f = 'g';
    return f;
  }

  function render(t, matches, truncated) {
    let html = '';
    let last = 0;
    for (const m of matches) {
      html += escapeHtml(t.slice(last, m.index));
      html += `<span class="match-highlight">${escapeHtml(m.value)}</span>`;
      last = m.index + m.value.length;
    }
    html += escapeHtml(t.slice(last));
    high.innerHTML = html;
    matchCount.textContent = truncated ? `${matches.length}+` : matches.length;
    groupsStat.textContent = matches.length && matches[0].groups.length
      ? `命名组: ${matches[0].groups.join(', ')}`
      : '';
  }

  function stopWorker() {
    if (worker) worker.terminate();
    worker = null;
  }

  function update() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runMatch, 80);
  }

  function runMatch() {
    const p = pattern.value;
    const f = getFlags();
    const t = text.value;
    const id = ++requestId;
    stopWorker();
    pattern.classList.remove('invalid');
    errStat.textContent = '';
    if (!p) {
      high.innerHTML = escapeHtml(t);
      matchCount.textContent = 0; groupsStat.textContent = '';
      return;
    }
    try { new RegExp(p, f); }
    catch (e) {
      pattern.classList.add('invalid');
      errStat.textContent = '错误：' + e.message;
      high.innerHTML = escapeHtml(t);
      matchCount.textContent = 0;
      return;
    }

    worker = new Worker('regex-worker.js');
    const timeout = setTimeout(() => {
      if (id !== requestId) return;
      stopWorker();
      pattern.classList.add('invalid');
      errStat.textContent = `匹配超过 ${TIMEOUT_MS}ms，已停止（正则可能存在灾难性回溯）`;
      matchCount.textContent = 0;
    }, TIMEOUT_MS);

    worker.addEventListener('message', (event) => {
      if (event.data.id !== id) return;
      clearTimeout(timeout);
      stopWorker();
      if (event.data.error) {
        pattern.classList.add('invalid');
        errStat.textContent = '错误：' + event.data.error;
        return;
      }
      render(t, event.data.matches, event.data.truncated);
      if (event.data.truncated) errStat.textContent = `结果过多，仅显示前 ${MAX_MATCHES} 项`;
    });
    worker.addEventListener('error', () => {
      if (id !== requestId) return;
      clearTimeout(timeout);
      stopWorker();
      errStat.textContent = '正则执行器加载失败，请通过本地服务器打开页面';
    });
    worker.postMessage({ id, pattern: p, flags: f, text: t, maxMatches: MAX_MATCHES });
  }

  function sync() {
    high.scrollTop = text.scrollTop;
    high.scrollLeft = text.scrollLeft;
  }

  function init() {
    pattern.addEventListener('input', update);
    text.addEventListener('input', () => {
      document.getElementById('meta') && (document.getElementById('meta').textContent = `${text.value.length} 字符`);
      update();
    });
    text.addEventListener('scroll', sync);
    ['gFlag','iFlag','mFlag','sFlag'].forEach(id => document.getElementById(id).addEventListener('change', update));
    document.getElementById('clearBtn').addEventListener('click', () => {
      clearTimeout(debounceTimer);
      stopWorker();
      text.value = ''; pattern.value = '';
      high.innerHTML = '';
      matchCount.textContent = 0;
    });
    text.value = 'MyTools 包含 JSON、URL、Base64、Hash、时间戳、UUID、正则等工具，例如邮箱 user@example.com 或 IPv4 192.168.1.1。';
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
