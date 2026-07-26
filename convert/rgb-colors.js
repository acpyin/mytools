(() => {
  const channels = ['red', 'green', 'blue'];
  const channelControls = channels.map(name => ({
    range: document.getElementById(`${name}Range`),
    number: document.getElementById(`${name}Number`),
  }));
  const hexInput = document.getElementById('hexInput');
  const nativeColor = document.getElementById('nativeColor');
  const preview = document.getElementById('rgbPreview');
  const previewText = document.getElementById('previewText');
  const rgbHint = document.getElementById('rgbHint');
  const clamp = value => Math.min(255, Math.max(0, Number.parseInt(value, 10) || 0));
  const toHex = values => `#${values.map(value => clamp(value).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  const fromHex = value => {
    const normalized = value.trim().replace(/^#/, '');
    const full = normalized.length === 3 ? [...normalized].map(x => x + x).join('') : normalized;
    if (!/^[0-9a-f]{6}$/i.test(full)) return null;
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
  };
  function updateConverter(values, source = 'rgb') {
    const safe = values.map(clamp);
    channelControls.forEach((controls, index) => {
      controls.range.value = safe[index];
      controls.number.value = safe[index];
    });
    const hex = toHex(safe);
    if (source !== 'hex' || hexInput.value.toUpperCase() !== hex) hexInput.value = hex;
    nativeColor.value = hex.toLowerCase();
    preview.style.background = hex;
    previewText.textContent = hex;
    rgbHint.textContent = `rgb(${safe.join(', ')}) · ${hex}`;
    hexInput.removeAttribute('aria-invalid');
  }
  channelControls.forEach((controls, index) => {
    controls.range.addEventListener('input', () => {
      const values = channelControls.map(x => clamp(x.range.value));
      values[index] = clamp(controls.range.value);
      updateConverter(values);
    });
    controls.number.addEventListener('input', () => {
      const values = channelControls.map(x => clamp(x.number.value));
      values[index] = clamp(controls.number.value);
      updateConverter(values);
    });
  });
  hexInput.addEventListener('input', () => {
    const values = fromHex(hexInput.value);
    if (values) updateConverter(values, 'hex');
    else {
      hexInput.setAttribute('aria-invalid', 'true');
      rgbHint.textContent = '请输入 3 位或 6 位十六进制颜色码，例如 #09F 或 #0099FF';
    }
  });
  hexInput.addEventListener('blur', () => {
    const values = fromHex(hexInput.value);
    if (values) updateConverter(values);
  });
  nativeColor.addEventListener('input', () => updateConverter(fromHex(nativeColor.value)));
  document.getElementById('copyHex').addEventListener('click', () => window.copyText(toHex(channelControls.map(x => x.number.value)), 'HEX 颜色码已复制'));
  document.getElementById('copyRgb').addEventListener('click', () => {
    const value = `rgb(${channelControls.map(x => clamp(x.number.value)).join(', ')})`;
    window.copyText(value, 'RGB 颜色值已复制');
  });

  const COLORS = [
    ['黑色','Black','#000000'],['暗灰','DimGray','#696969'],['灰色','Gray','#808080'],['银色','Silver','#C0C0C0'],['白烟','WhiteSmoke','#F5F5F5'],['白色','White','#FFFFFF'],
    ['栗色','Maroon','#800000'],['深红','DarkRed','#8B0000'],['红色','Red','#FF0000'],['番茄红','Tomato','#FF6347'],['珊瑚红','Coral','#FF7F50'],['鲑鱼色','Salmon','#FA8072'],
    ['橙红','OrangeRed','#FF4500'],['橙色','Orange','#FFA500'],['金色','Gold','#FFD700'],['卡其色','Khaki','#F0E68C'],['象牙白','Ivory','#FFFFF0'],['黄色','Yellow','#FFFF00'],
    ['橄榄色','Olive','#808000'],['黄绿色','YellowGreen','#9ACD32'],['草坪绿','LawnGreen','#7CFC00'],['绿色','Green','#008000'],['森林绿','ForestGreen','#228B22'],['海洋绿','SeaGreen','#2E8B57'],
    ['春绿色','SpringGreen','#00FF7F'],['薄荷奶油','MintCream','#F5FFFA'],['青色','Cyan','#00FFFF'],['绿松石','Turquoise','#40E0D0'],['深青色','DarkCyan','#008B8B'],['水鸭色','Teal','#008080'],
    ['天蓝色','SkyBlue','#87CEEB'],['深天蓝','DeepSkyBlue','#00BFFF'],['道奇蓝','DodgerBlue','#1E90FF'],['钢蓝','SteelBlue','#4682B4'],['皇家蓝','RoyalBlue','#4169E1'],['蓝色','Blue','#0000FF'],
    ['海军蓝','Navy','#000080'],['午夜蓝','MidnightBlue','#191970'],['靛青','Indigo','#4B0082'],['紫色','Purple','#800080'],['紫罗兰','Violet','#EE82EE'],['兰花紫','Orchid','#DA70D6'],
    ['品红','Magenta','#FF00FF'],['深粉红','DeepPink','#FF1493'],['热粉红','HotPink','#FF69B4'],['粉红','Pink','#FFC0CB'],['薰衣草','Lavender','#E6E6FA'],['米色','Beige','#F5F5DC'],
    ['小麦色','Wheat','#F5DEB3'],['棕褐色','Tan','#D2B48C'],['巧克力','Chocolate','#D2691E'],['棕色','Brown','#A52A2A'],['雪白','Snow','#FFFAFA'],['爱丽丝蓝','AliceBlue','#F0F8FF'],
  ];
  const PALETTES = [
    ['清新海岸',['#0F4C5C','#2C7DA0','#61A5C2','#A9D6E5','#E8F7FA']],
    ['国风青绿',['#1A535C','#4ECDC4','#B7E4C7','#D8F3DC','#F1FAEE']],
    ['落日晚霞',['#5F0F40','#9A031E','#FB8B24','#E36414','#FFCF99']],
    ['现代莫兰迪',['#6B705C','#A5A58D','#B7B7A4','#DDBEA9','#FFE8D6']],
    ['深夜霓虹',['#240046','#5A189A','#9D4EDD','#C77DFF','#E0AAFF']],
    ['柔和樱花',['#7D4E57','#B56576','#E56B6F','#EAAC8B','#FFE5D9']],
    ['商务蓝灰',['#0B132B','#1C2541','#3A506B','#5BC0BE','#E6F1F2']],
    ['森林暖阳',['#283618','#606C38','#DDA15E','#BC6C25','#FEFAE0']],
  ];
  const grid = document.getElementById('standardView');
  const paletteView = document.getElementById('paletteView');
  const paletteList = document.getElementById('paletteList');
  const search = document.getElementById('colorSearch');
  const count = document.getElementById('colorCount');
  const rgb = hex => {
    const n = parseInt(hex.slice(1), 16);
    return `${n >> 16}, ${(n >> 8) & 255}, ${n & 255}`;
  };
  function renderColors() {
    const keyword = search.value.trim().toLowerCase();
    const items = COLORS.filter(x => `${x.join(' ')} rgb(${rgb(x[2])})`.toLowerCase().includes(keyword));
    grid.innerHTML = items.length ? items.map(x => `
      <button class="color-card" type="button" data-color="${x[2]}" title="点击复制 ${x[2]}">
        <span class="color-swatch" style="display:block;background:${x[2]}"></span>
        <span class="color-meta"><span class="color-name">${x[0]} · ${x[1]}</span>
        <span class="color-values"><span>${x[2]}</span><span>rgb(${rgb(x[2])})</span></span></span>
      </button>`).join('') : '<div class="empty-state">没有找到匹配颜色</div>';
    count.textContent = `${items.length} 种颜色`;
  }
  paletteList.innerHTML = PALETTES.map(p => `<article class="palette-card"><div class="palette-title">${p[0]}</div><div class="palette-colors">${
    p[1].map(c => `<button class="palette-color" type="button" data-color="${c}" style="background:${c}" title="复制 ${c}"><span>${c}</span></button>`).join('')
  }</div></article>`).join('');
  document.addEventListener('click', event => {
    const color = event.target.closest('[data-color]')?.dataset.color;
    if (color) window.copyText(color, `已复制 ${color}`);
  });
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x === button));
    const standard = button.dataset.view === 'standard';
    grid.hidden = !standard; paletteView.hidden = standard; search.hidden = !standard;
    count.textContent = standard ? `${COLORS.length} 种颜色` : `${PALETTES.length} 组配色`;
    if (standard) renderColors();
  }));
  search.addEventListener('input', renderColors);
  updateConverter([30, 144, 255]);
  renderColors();
})();
