(() => {
  const target = document.getElementById('mergeView');
  let mv = null;
  let originalValue = '';
  let contrastValue = '';
  let inBuild = false;

  const SAMPLE_LEFT = JSON.stringify({
    name: "CompareJSON", version: "1.0.0", author: "Kilo",
    tags: ["json", "diff", "tool"],
    features: { format: true, sort: false, bigint: true },
    deprecated: false, sample: 123456789012345
  }, null, 2);

  const SAMPLE_RIGHT = JSON.stringify({
    name: "CompareJSON", version: "1.0.1", author: "diff",
    tags: ["json", "diff", "compare"],
    features: { format: true, sort: true, bigint: true, theme: "light" },
    deprecated: false, sample: "123456789012345"
  }, null, 2);

  // Helpers — CodeMirror MergeView returns { left, right, editor() }, where
  // mv.left and mv.right are CodeMirror instances.
  // (Some versions return wrappers with .cm — handle both)
  function leftCm() {
    if (!mv) return null;
    return typeof mv.editor === 'function' ? mv.editor() : null;
  }
  function rightCm() {
    if (!mv) return null;
    return typeof mv.rightOriginal === 'function' ? mv.rightOriginal() : null;
  }

  function normalizePastedJson(text) {
    let value = text.trim();
    if (!value) return null;

    // Support raw JSON, JSON encoded as a string, and repeatedly escaped JSON.
    for (let depth = 0; depth < 4; depth++) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') {
          value = parsed.trim();
          continue;
        }
        if (parsed !== null && typeof parsed === 'object') {
          return JSON.stringify(parsed, null, 2);
        }
        return JSON.stringify(parsed);
      } catch (_) {
        // Common clipboard form without surrounding quotes: {\"name\":\"value\"}
        if (depth === 0) {
          try {
            const unescaped = JSON.parse(`"${value}"`);
            if (typeof unescaped === 'string' && unescaped !== value) {
              value = unescaped.trim();
              continue;
            }
          } catch (_) {}
        }
        return null;
      }
    }
    return null;
  }

  function enableSmartPaste(cm) {
    cm.on('paste', (_editor, event) => {
      const clipboard = event.clipboardData || window.clipboardData;
      if (!clipboard) return;
      const text = clipboard.getData('text/plain');
      const formatted = normalizePastedJson(text);
      if (formatted === null) return;
      event.preventDefault();
      cm.replaceSelection(formatted, 'end', 'paste');
      cm.setCursor(cm.getCursor('to'));
      const s = document.getElementById('parseStatus');
      if (s) {
        s.textContent = '✓ 已反转义并格式化';
        s.className = 'status-msg ok';
      }
      if (typeof window.toast === 'function') window.toast('已反转义并格式化');
    });
  }

  function collapseSelectionAfterPaste(cm) {
    cm.on('paste', () => {
      setTimeout(() => {
        const end = cm.getCursor('to');
        cm.setCursor(end);
      }, 0);
    });
  }

  function destroy() {
    if (!mv) return;
    try {
      const l = leftCm(); if (l && l.toTextArea) l.toTextArea();
      const r = rightCm(); if (r && r.toTextArea) r.toTextArea();
    } catch (_) {}
    mv = null;
  }

  function buildView() {
    destroy();
    target.innerHTML = '';
    if (typeof window.diff_match_patch === 'undefined') {
      target.innerHTML = '<div style="padding:20px;color:#dc2626;">diff-match-patch 未加载</div>';
      return;
    }
    if (typeof CodeMirror === 'undefined' || typeof CodeMirror.MergeView === 'undefined') {
      target.innerHTML = '<div style="padding:20px;color:#dc2626;">CodeMirror MergeView 未加载</div>';
      return;
    }
    inBuild = true;
    mv = CodeMirror.MergeView(target, {
      value: originalValue,
      orig: contrastValue,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'application/json',
      highlightDifferences: true,
      connect: 'align',
      collapseIdentical: false,
      allowEditingOriginals: true,
      revertButtons: false,
      indentUnit: 2,
      tabSize: 2,
    });
    inBuild = false;
    const l = leftCm(), r = rightCm();
    if (l) {
      l.getWrapperElement().setAttribute('role', 'region');
      l.getWrapperElement().setAttribute('aria-label', 'A · 原始 JSON');
      l.getInputField().setAttribute('aria-label', 'A · 原始 JSON');
    }
    if (r) {
      r.getWrapperElement().setAttribute('role', 'region');
      r.getWrapperElement().setAttribute('aria-label', 'B · 对比 JSON');
      r.getInputField().setAttribute('aria-label', 'B · 对比 JSON');
    }
    if (l) {
      l.on('change', onChange);
      enableSmartPaste(l);
      collapseSelectionAfterPaste(l);
    }
    if (r) {
      r.on('change', onChange);
      enableSmartPaste(r);
      collapseSelectionAfterPaste(r);
    }
    updateValidity();
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
    const s = document.getElementById('parseStatus');
    if (s) { s.textContent = '✓ 已对比'; s.className = 'status-msg ok'; }
  }

  function updateValidity() {
    ['a', 'b'].forEach(side => {
      const text = side === 'a' ? originalValue : contrastValue;
      const label = document.getElementById(side + 'Label');
      const head = document.getElementById('header' + side.toUpperCase());

      let state, text2;
      if (!text.trim()) {
        state = 'empty'; text2 = '空';
      } else {
        try { JSON.parse(text); state = 'valid'; text2 = '有效'; }
        catch (e) { state = 'invalid'; text2 = '无效 · ' + (e.message.slice(0, 40) || '解析失败'); }
      }

      if (label) label.textContent = text2;
      if (head) {
        head.classList.remove('valid', 'invalid');
        if (state !== 'empty') head.classList.add(state);
      }
    });
  }

  function updateCounts() {
    let add = 0, del = 0;
    target.querySelectorAll('.CodeMirror-merge-inserted').forEach(el => {
      el.querySelectorAll('.CodeMirror-linebackground').forEach(() => add++);
    });
    target.querySelectorAll('.CodeMirror-merge-deleted').forEach(el => {
      el.querySelectorAll('.CodeMirror-linebackground').forEach(() => del++);
    });
    document.getElementById('addCount').textContent = add;
    document.getElementById('delCount').textContent = del;
  }

  function init() {
    // === Settings modal ===
    const modal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsClose = document.getElementById('settingsClose');
    const settingsSave = document.getElementById('settingsSave');
    const settingsReset = document.getElementById('settingsReset');

    function openModal() { if (modal) modal.hidden = false; }
    function closeModal() { if (modal) modal.hidden = true; }

    function saveSettings() {
      const s = {
        indent: document.getElementById('optIndent').value,
        highlight: document.getElementById('optHighlight').value,
        collapse: parseInt(document.getElementById('optCollapse').value, 10),
        autoFocus: document.getElementById('optAutoFocus').checked,
      };
      try { localStorage.setItem('mytools.jsondiff', JSON.stringify(s)); } catch (_) {}
      window.toast('已保存');
      closeModal();
    }

    function loadSettings() {
      let s;
      try { s = JSON.parse(localStorage.getItem('mytools.jsondiff') || '{}'); } catch (_) {}
      if (s.indent) document.getElementById('optIndent').value = s.indent;
      if (s.highlight) document.getElementById('optHighlight').value = s.highlight;
      if (Number.isFinite(s.collapse)) document.getElementById('optCollapse').value = String(s.collapse);
      if (typeof s.autoFocus === 'boolean') document.getElementById('optAutoFocus').checked = s.autoFocus;
    }

    if (settingsBtn) settingsBtn.addEventListener('click', openModal);
    if (settingsClose) settingsClose.addEventListener('click', closeModal);
    if (settingsSave) settingsSave.addEventListener('click', saveSettings);
    if (settingsReset) settingsReset.addEventListener('click', () => {
      try { localStorage.removeItem('mytools.jsondiff'); } catch (_) {}
      location.reload();
    });
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    loadSettings();

    document.getElementById('sampleBtn').addEventListener('click', () => {
      originalValue = SAMPLE_LEFT; contrastValue = SAMPLE_RIGHT; buildView();
      window.toast('已加载示例');
    });
    document.getElementById('swapBtn').addEventListener('click', () => {
      const t = originalValue; originalValue = contrastValue; contrastValue = t; buildView();
      window.toast('已交换');
    });
    document.getElementById('clearBtn').addEventListener('click', () => {
      originalValue = ''; contrastValue = ''; buildView();
      window.toast('已清空');
    });
    document.getElementById('formatBtn').addEventListener('click', () => {
      let any = false;
      ['a', 'b'].forEach(side => {
        const text = side === 'a' ? originalValue : contrastValue;
        if (!text || !text.trim()) return;
        try {
          const obj = JSON.parse(text);
          const out = JSON.stringify(obj, null, 2);
          if (side === 'a') originalValue = out;
          else contrastValue = out;
          any = true;
        } catch (_) {
          // skip invalid side
        }
      });
      if (any) { buildView(); window.toast('已格式化'); }
      else { window.toast('两侧都无效，未格式化'); }
    });
    document.getElementById('unescapeBtn').addEventListener('click', () => {
      let any = false;
      ['a', 'b'].forEach(side => {
        const text = side === 'a' ? originalValue : contrastValue;
        if (!text || !text.trim()) return;
        const trimmed = text.trim();
        // Only attempt if wrapped in double quotes (a JSON string literal)
        if (!(trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2)) return;
        try {
          const inner = JSON.parse(trimmed);
          if (typeof inner !== 'string') return;
          // Then format the unescaped string as JSON
          try {
            const obj = JSON.parse(inner);
            const out = JSON.stringify(obj, null, 2);
            if (side === 'a') originalValue = out;
            else contrastValue = out;
          } catch (_) {
            // inner is not JSON; just write the unescaped raw string
            if (side === 'a') originalValue = inner;
            else contrastValue = inner;
          }
          any = true;
        } catch (_) {
          // not a valid JSON string literal; skip
        }
      });
      if (any) { buildView(); window.toast('已反转义并格式化'); }
      else { window.toast('没有发现需要反转义的内容'); }
    });
    // Start empty — no sample preloaded
    originalValue = ''; contrastValue = ''; buildView();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
