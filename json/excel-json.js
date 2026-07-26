(() => {
  const table = document.getElementById('tableInput');
  const json = document.getElementById('jsonInput');
  const shape = document.getElementById('jsonShape');
  const indent = document.getElementById('indent');
  const smart = document.getElementById('smartTypes');
  const file = document.getElementById('fileInput');
  const drop = document.getElementById('dropZone');
  let workbook = null;

  const parseCell = value => {
    const text = String(value).trim();
    if (!smart.checked) return value;
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(text)) return Number(text);
    if (/^(true|false)$/i.test(text)) return text.toLowerCase() === 'true';
    if (/^null$/i.test(text)) return null;
    return value;
  };
  function parseDelimited(value) {
    const lines = value.replace(/\r\n?/g, '\n').split('\n').filter((line, i, all) => line || i < all.length - 1);
    const delimiter = lines.some(line => line.includes('\t')) ? '\t' : ',';
    return lines.map(line => delimiter === '\t' ? line.split('\t') : parseCsvLine(line));
  }
  function parseCsvLine(line) {
    const cells = []; let cell = ''; let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && quoted && line[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = !quoted;
      else if (ch === ',' && !quoted) { cells.push(cell); cell = ''; }
      else cell += ch;
    }
    cells.push(cell); return cells;
  }
  function rowsToValue(rows) {
    if (shape.value === 'arrays') return rows.map(row => row.map(parseCell));
    if (!rows.length) return [];
    const headers = rows[0].map((x, i) => String(x).trim() || `column_${i + 1}`);
    return rows.slice(1).filter(row => row.some(x => String(x).trim() !== '')).map(row =>
      Object.fromEntries(headers.map((key, i) => [key, parseCell(row[i] ?? '')]))
    );
  }
  function toJson() {
    try {
      const value = rowsToValue(parseDelimited(table.value));
      json.value = JSON.stringify(value, null, Number(indent.value) || 0);
      window.toast('已转换为 JSON');
    } catch (error) { window.toast(`转换失败：${error.message}`); }
  }
  function jsonRows() {
    const value = JSON.parse(json.value);
    if (!Array.isArray(value)) throw new Error('JSON 根节点必须是数组');
    if (!value.length) return [];
    if (Array.isArray(value[0])) return value;
    if (typeof value[0] !== 'object' || value[0] === null) return [['value'], ...value.map(x => [x])];
    const headers = [...new Set(value.flatMap(item => Object.keys(item)))];
    return [headers, ...value.map(item => headers.map(key => {
      const cell = item[key];
      return cell != null && typeof cell === 'object' ? JSON.stringify(cell) : (cell ?? '');
    }))];
  }
  function toTable() {
    try {
      table.value = jsonRows().map(row => row.map(x => String(x).replace(/\t/g, ' ')).join('\t')).join('\n');
      window.toast('已转换为表格，可直接粘贴到 Excel');
    } catch (error) { window.toast(`JSON 错误：${error.message}`); }
  }
  async function openFile(selected) {
    if (!selected) return;
    try {
      const data = await selected.arrayBuffer();
      workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      table.value = XLSX.utils.sheet_to_csv(sheet, { FS: '\t' });
      toJson();
      window.toast(`已读取工作表：${workbook.SheetNames[0]}`);
    } catch (error) { window.toast(`文件读取失败：${error.message}`); }
  }
  function download(blob, name) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  document.getElementById('toJson').addEventListener('click', toJson);
  document.getElementById('toTable').addEventListener('click', toTable);
  document.getElementById('copyJson').addEventListener('click', () => window.copyText(json.value, 'JSON 已复制'));
  document.getElementById('downloadJson').addEventListener('click', () => download(new Blob([json.value], {type:'application/json;charset=utf-8'}), 'data.json'));
  document.getElementById('downloadExcel').addEventListener('click', () => {
    try {
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(jsonRows()), 'Sheet1');
      XLSX.writeFile(book, 'data.xlsx');
    } catch (error) { window.toast(`导出失败：${error.message}`); }
  });
  document.getElementById('sampleBtn').addEventListener('click', () => {
    table.value = '姓名\t年龄\t城市\t启用\n张三\t28\t杭州\ttrue\n李四\t31\t上海\tfalse';
    toJson();
  });
  document.getElementById('clearBtn').addEventListener('click', () => { table.value = ''; json.value = ''; table.focus(); });
  file.addEventListener('change', () => openFile(file.files[0]));
  drop.addEventListener('click', () => file.click());
  ['dragenter','dragover'].forEach(type => drop.addEventListener(type, e => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave','drop'].forEach(type => drop.addEventListener(type, e => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', e => openFile(e.dataTransfer.files[0]));
  table.addEventListener('paste', () => setTimeout(toJson));
  table.focus();
})();
