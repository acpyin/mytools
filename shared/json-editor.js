/* shared/json-editor.js — CodeMirror-backed JSON editor with brace folding.
 *
 * Usage:
 *   const ed = JsonEditor.upgrade(textarea, options);
 *   ed.getValue()   // current text
 *   ed.setValue(v)  // set text
 *   ed.cm           // underlying CodeMirror instance
 *   ed.refresh()    // re-fit and update gutters
 *   ed.destroy()    // restore the textarea
 *
 * Options:
 *   { readOnly, lineNumbers, foldGutter, mode, theme, onChange, placeholder }
 *
 * The original <textarea> is hidden (kept in DOM for layout reference) and a
 * CodeMirror instance is mounted in the same parent. The textarea's `.value`
 * stays in sync, so existing code that reads/writes it still works.
 */
(() => {
  'use strict';

  function upgrade(textarea, options) {
    if (!textarea || textarea.dataset.jeUpgraded === '1') {
      return textarea && textarea._je ? textarea._je : null;
    }
    const opts = Object.assign({
      readOnly: false,
      lineNumbers: true,
      foldGutter: true,
      fold: 'brace',
      mode: 'application/json',
      onChange: null,
      placeholder: ''
    }, options || {});

    if (typeof CodeMirror === 'undefined') {
      console.error('JsonEditor: CodeMirror not loaded');
      return null;
    }

    const parent = textarea.parentNode;
    const holder = document.createElement('div');
    holder.className = 'json-editor-host';
    parent.insertBefore(holder, textarea);
    textarea.style.display = 'none';
    holder.appendChild(textarea);

    const cm = CodeMirror(holder, {
      value: textarea.value || '',
      readOnly: opts.readOnly,
      lineNumbers: opts.lineNumbers,
      foldGutter: opts.foldGutter,
      gutters: opts.foldGutter ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'] : ['CodeMirror-linenumbers'],
      mode: opts.mode,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      placeholder: opts.placeholder,
      // Cmd/Ctrl+Alt+[/] to fold/unfold current block
      extraKeys: {
        'Ctrl-Alt-[': cm => cm.foldCode(cm.getCursor()),
        'Ctrl-Alt-]': cm => cm.foldAll ? cm.foldAll() : null,
        'Cmd-Alt-[': cm => cm.foldCode(cm.getCursor()),
        'Cmd-Alt-]': cm => cm.foldAll ? cm.foldAll() : null
      }
    });

    // Sync CM → textarea
    cm.on('change', () => {
      const v = cm.getValue();
      if (textarea.value !== v) textarea.value = v;
      if (typeof opts.onChange === 'function') opts.onChange(v, cm);
    });

    // Sync textarea → CM (if some other code sets textarea.value)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    Object.defineProperty(textarea, 'value', {
      get() { return cm.getValue(); },
      set(v) {
        const cur = cm.getValue();
        setter.call(textarea, v);
        if (v !== cur) cm.setValue(v == null ? '' : String(v));
      },
      configurable: true
    });

    const api = {
      cm,
      getValue() { return cm.getValue(); },
      setValue(v) { cm.setValue(v == null ? '' : String(v)); },
      refresh() { setTimeout(() => cm.refresh(), 0); },
      focus() { cm.focus(); },
      foldAll() { if (cm.foldAll) cm.foldAll(); },
      unfoldAll() { if (cm.unfoldAll) cm.unfoldAll(); },
      destroy() {
        cm.toTextArea();
        holder.parentNode && holder.parentNode.insertBefore(textarea, holder);
        holder.remove();
        textarea.style.display = '';
        delete textarea.dataset.jeUpgraded;
        textarea._je = null;
      }
    };
    textarea._je = api;
    textarea.dataset.jeUpgraded = '1';
    return api;
  }

  function upgradeAll(root, selector, options) {
    const nodes = (root || document).querySelectorAll(selector || 'textarea');
    return Array.from(nodes).map(t => upgrade(t, options));
  }

  window.JsonEditor = { upgrade, upgradeAll };
})();