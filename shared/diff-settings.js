(() => {
  const STORAGE_KEY = 'mytools.diff.appearance';
  const PRESETS = {
    default:      { a: '#0072b2', b: '#d55e00', aStyle: 'solid',  bStyle: 'dashed' },
    deuteranopia: { a: '#0072b2', b: '#e69f00', aStyle: 'solid',  bStyle: 'dashed' },
    protanopia:   { a: '#0072b2', b: '#f0e442', aStyle: 'solid',  bStyle: 'dashed' },
    tritanopia:   { a: '#009e73', b: '#cc79a7', aStyle: 'solid',  bStyle: 'dashed' },
    monochrome:   { a: '#111827', b: '#6b7280', aStyle: 'double', bStyle: 'dashed' },
  };
  let settings = { mode: 'default', ...PRESETS.default };

  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      settings = { ...settings, ...saved };
    } catch (_) {}
  }

  function applySettings(value = settings) {
    const root = document.documentElement.style;
    root.setProperty('--diff-a-underline', value.a);
    root.setProperty('--diff-b-underline', value.b);
    root.setProperty('--diff-a-underline-style', value.aStyle || 'solid');
    root.setProperty('--diff-b-underline-style', value.bStyle || 'dashed');
  }

  function syncControls() {
    const mode = document.getElementById('optVisionMode');
    const a = document.getElementById('optAUnderline');
    const b = document.getElementById('optBUnderline');
    if (mode) mode.value = settings.mode || 'custom';
    if (a) a.value = settings.a;
    if (b) b.value = settings.b;
    updateColorLabels();
  }

  function updateColorLabels() {
    const a = document.getElementById('optAUnderline');
    const b = document.getElementById('optBUnderline');
    const at = document.getElementById('optAUnderlineText');
    const bt = document.getElementById('optBUnderlineText');
    if (a && at) at.textContent = a.value;
    if (b && bt) bt.textContent = b.value;
  }

  function currentFromControls() {
    const mode = document.getElementById('optVisionMode')?.value || 'custom';
    const preset = PRESETS[mode];
    return {
      mode,
      a: document.getElementById('optAUnderline')?.value || settings.a,
      b: document.getElementById('optBUnderline')?.value || settings.b,
      aStyle: preset?.aStyle || settings.aStyle || 'solid',
      bStyle: preset?.bStyle || settings.bStyle || 'dashed',
    };
  }

  function init() {
    readSettings();
    applySettings();
    syncControls();

    const modal = document.getElementById('settingsModal');
    const open = document.getElementById('settingsBtn');
    const close = document.getElementById('settingsClose');
    const save = document.getElementById('settingsSave');
    const reset = document.getElementById('settingsReset');
    const mode = document.getElementById('optVisionMode');
    const a = document.getElementById('optAUnderline');
    const b = document.getElementById('optBUnderline');

    if (open) open.addEventListener('click', () => {
      if (modal) modal.hidden = false;
      syncControls();
    });
    if (close) close.addEventListener('click', () => { if (modal) modal.hidden = true; });
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });

    if (mode) mode.addEventListener('change', () => {
      const preset = PRESETS[mode.value];
      if (preset) {
        a.value = preset.a;
        b.value = preset.b;
        settings = { mode: mode.value, ...preset };
        updateColorLabels();
        applySettings(settings);
      }
    });
    [a, b].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        mode.value = 'custom';
        settings = currentFromControls();
        updateColorLabels();
        applySettings(settings);
      });
    });
    if (save) save.addEventListener('click', () => {
      settings = currentFromControls();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (_) {}
      applySettings();
      if (modal) modal.hidden = true;
      if (typeof window.toast === 'function') window.toast('差异颜色已保存');
    });
    if (reset) reset.addEventListener('click', () => {
      settings = { mode: 'default', ...PRESETS.default };
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      applySettings();
      syncControls();
      if (typeof window.toast === 'function') window.toast('已恢复默认差异颜色');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
