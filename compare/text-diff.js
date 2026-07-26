(() => {
  const target = document.getElementById('mergeView');

  const SAMPLE_LEFT = `Line 1: 第一行
Line 2: 这是原始文本
Line 3: 第二行
Line 4: hello world
Line 5: end`;

  const SAMPLE_RIGHT = `Line 1: 第一行
Line 2: 这是修改后的文本
Line 3: 插入的新行
Line 4: hello world
Line 5: end`;

  let mv = null;
  let originalValue = '';
  let contrastValue = '';
  let inBuild = false;

  function leftCm() {
    if (!mv) return null;
    return typeof mv.editor === 'function' ? mv.editor() : null;
  }
  function rightCm() {
    if (!mv) return null;
    return typeof mv.rightOriginal === 'function' ? mv.rightOriginal() : null;
  }

  function destroy() {
    if (!mv) return;
    try { const l = leftCm(); if (l && l.toTextArea) l.toTextArea();
          const r = rightCm(); if (r && r.toTextArea) r.toTextArea(); } catch (_) {}
    mv = null;
  }

  function collapseSelectionAfterPaste(cm) {
    cm.on('paste', () => {
      setTimeout(() => {
        const end = cm.getCursor('to');
        cm.setCursor(end);
      }, 0);
    });
  }

  function buildView() {
    destroy();
    target.innerHTML = '';
    if (typeof window.diff_match_patch === 'undefined') {
      target.innerHTML = '<div style="padding:20px;color:#dc2626;">diff-match-patch 未加载</div>';
      return;
    }
    inBuild = true;
    mv = CodeMirror.MergeView(target, {
      value: originalValue, orig: contrastValue,
      lineNumbers: true, lineWrapping: true, mode: 'text/plain',
      highlightDifferences: true, connect: 'align', collapseIdentical: false,
      allowEditingOriginals: true, revertButtons: false,
    });
    inBuild = false;
    const l = leftCm(), r = rightCm();
    if (l) {
      l.getWrapperElement().setAttribute('role', 'region');
      l.getWrapperElement().setAttribute('aria-label', 'A · 原始文本');
      l.getInputField().setAttribute('aria-label', 'A · 原始文本');
    }
    if (r) {
      r.getWrapperElement().setAttribute('role', 'region');
      r.getWrapperElement().setAttribute('aria-label', 'B · 对比文本');
      r.getInputField().setAttribute('aria-label', 'B · 对比文本');
    }
    if (l) {
      l.on('change', onChange);
      collapseSelectionAfterPaste(l);
    }
    if (r) {
      r.on('change', onChange);
      collapseSelectionAfterPaste(r);
    }
    updateValidity();
    updateCounts();
    // Auto-focus the left (A) editor on initial load
    if (l && l.focus) {
      setTimeout(() => { try { l.focus(); l.setCursor({ line: 0, ch: 0 }); } catch (_) {} }, 50);
    }
  }

  function onChange() {
    if (inBuild) return;
    const l = leftCm(), r = rightCm();
    if (l) originalValue = l.getValue();
    if (r) contrastValue = r.getValue();
    updateValidity();
    updateCounts();
  }

  function updateCounts() {
    let add = 0, del = 0;
    target.querySelectorAll('.CodeMirror-merge-inserted').forEach(el => el.querySelectorAll('.CodeMirror-linebackground').forEach(() => add++));
    target.querySelectorAll('.CodeMirror-merge-deleted').forEach(el => el.querySelectorAll('.CodeMirror-linebackground').forEach(() => del++));
    document.getElementById('addCount').textContent = add;
    document.getElementById('delCount').textContent = del;
  }

  function updateValidity() {
    ['a', 'b'].forEach(side => {
      const text = side === 'a' ? originalValue : contrastValue;
      const label = document.getElementById(side + 'Label');
      const head = document.getElementById('header' + side.toUpperCase());
      if (!text || !text.trim()) {
        if (label) label.textContent = '空';
        if (head) { head.classList.remove('valid', 'invalid'); }
      } else {
        const lines = text.split('\n').length;
        const chars = text.length;
        if (label) label.textContent = `${chars} 字符 · ${lines} 行`;
        if (head) { head.classList.remove('invalid'); head.classList.add('valid'); }
      }
    });
  }

function init() {
    document.getElementById('sampleBtn').addEventListener('click', () => { originalValue = SAMPLE_LEFT; contrastValue = SAMPLE_RIGHT; buildView(); window.toast('已加载示例'); });
    document.getElementById('swapBtn').addEventListener('click', () => { const t = originalValue; originalValue = contrastValue; contrastValue = t; buildView(); });
    document.getElementById('clearBtn').addEventListener('click', () => { originalValue = ''; contrastValue = ''; buildView(); window.toast('已清空'); });
    // Start empty — no sample preloaded
    originalValue = ''; contrastValue = ''; buildView();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
