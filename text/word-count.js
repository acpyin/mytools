(() => {
  const input = document.getElementById('input');
  const stats = document.getElementById('stats');

  function update() {
    const s = input.value;
    const charsAll = s.length;
    const charsNoWs = s.replace(/\s/g, '').length;
    const words = s.trim() ? s.trim().split(/\s+/).length : 0;
    const lines = s.split('\n').length;
    const chinese = (s.match(/[\u4e00-\u9fff]/g) || []).length;
    const english = (s.match(/[A-Za-z]/g) || []).length;
    const digits = (s.match(/\d/g) || []).length;
    const punctuation = (s.match(/[，。！？、；：""''《》【】()（）,.!?;:"'<>?(){}\[\]/\\]/g) || []).length;
    stats.innerHTML = [
      ['字符数（含空白）', charsAll],
      ['字符数（不含空白）', charsNoWs],
      ['字数/词数', words],
      ['行数', lines],
      ['中文字符', chinese],
      ['英文字符', english],
      ['数字字符', digits],
      ['标点符号', punctuation],
    ].map(([k,v]) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
  }
  input.addEventListener('input', update);
  update();
})();
