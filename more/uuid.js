(() => {
  function uuidv4() {
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    let s = '';
    for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, '0');
    return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`;
  }

  function bytesToUuid(bytes, version) {
    const out = new Uint8Array(bytes.slice(0, 16));
    out[6] = (out[6] & 0x0f) | (version << 4);
    out[8] = (out[8] & 0x3f) | 0x80;
    const hex = [...out].map(value => value.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }

  function uuidToBytes(value) {
    const hex = value.replace(/-/g, '');
    if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error('命名空间必须是合法的 36 字符 UUID');
    return new Uint8Array(hex.match(/../g).map(part => parseInt(part, 16)));
  }

  function md5Bytes(input) {
    const shifts = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
    const constants = Array.from({length: 64}, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0);
    const paddedLength = Math.ceil((input.length + 9) / 64) * 64;
    const data = new Uint8Array(paddedLength);
    data.set(input); data[input.length] = 0x80;
    const bitLength = BigInt(input.length) * 8n;
    for (let i = 0; i < 8; i++) data[paddedLength - 8 + i] = Number((bitLength >> BigInt(i * 8)) & 0xffn);
    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    const rotate = (value, amount) => ((value << amount) | (value >>> (32 - amount))) >>> 0;
    for (let offset = 0; offset < data.length; offset += 64) {
      const words = Array.from({length: 16}, (_, i) => {
        const p = offset + i * 4;
        return (data[p] | data[p+1] << 8 | data[p+2] << 16 | data[p+3] << 24) >>> 0;
      });
      let a = a0, b = b0, c = c0, d = d0;
      for (let i = 0; i < 64; i++) {
        let f, g;
        if (i < 16) { f = (b & c) | (~b & d); g = i; }
        else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
        else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
        else { f = c ^ (b | ~d); g = (7 * i) % 16; }
        const next = d;
        d = c; c = b;
        b = (b + rotate((a + f + constants[i] + words[g]) >>> 0, shifts[i])) >>> 0;
        a = next;
      }
      a0 = (a0 + a) >>> 0; b0 = (b0 + b) >>> 0; c0 = (c0 + c) >>> 0; d0 = (d0 + d) >>> 0;
    }
    const digest = new Uint8Array(16);
    [a0,b0,c0,d0].forEach((word, i) => {
      digest[i*4] = word & 255; digest[i*4+1] = (word >>> 8) & 255;
      digest[i*4+2] = (word >>> 16) & 255; digest[i*4+3] = (word >>> 24) & 255;
    });
    return digest;
  }

  async function nameUuid(version) {
    const preset = document.getElementById('namespacePreset').value;
    const namespace = preset === 'custom' ? document.getElementById('customNamespace').value.trim() : preset;
    const namespaceBytes = uuidToBytes(namespace);
    const nameBytes = new TextEncoder().encode(document.getElementById('nameValue').value);
    const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
    data.set(namespaceBytes); data.set(nameBytes, namespaceBytes.length);
    const digest = version === '3'
      ? md5Bytes(data)
      : new Uint8Array(await crypto.subtle.digest('SHA-1', data));
    return bytesToUuid(digest, Number(version));
  }

  const v1Seed = crypto.getRandomValues(new Uint8Array(8));
  const v1Node = new Uint8Array(v1Seed.slice(0, 6));
  v1Node[0] |= 0x01; // RFC 9562: mark a randomly generated node ID as multicast.
  let v1ClockSeq = ((v1Seed[6] << 8) | v1Seed[7]) & 0x3fff;
  let lastV1Timestamp = 0n;

  function uuidv1() {
    // Number of 100 ns intervals since 1582-10-15 (Gregorian epoch).
    let timestamp = (BigInt(Date.now()) + 12219292800000n) * 10000n;
    if (timestamp <= lastV1Timestamp) timestamp = lastV1Timestamp + 1n;
    lastV1Timestamp = timestamp;

    const timeLow = Number(timestamp & 0xffffffffn);
    const timeMid = Number((timestamp >> 32n) & 0xffffn);
    const timeHigh = Number((timestamp >> 48n) & 0x0fffn) | 0x1000;
    const clockHigh = ((v1ClockSeq >> 8) & 0x3f) | 0x80;
    const clockLow = v1ClockSeq & 0xff;
    v1ClockSeq = (v1ClockSeq + 1) & 0x3fff;

    const hex = (n, width) => n.toString(16).padStart(width, '0');
    const node = [...v1Node].map(n => hex(n, 2)).join('');
    return `${hex(timeLow, 8)}-${hex(timeMid, 4)}-${hex(timeHigh, 4)}-${hex(clockHigh, 2)}${hex(clockLow, 2)}-${node}`;
  }

  function uuidv2() {
    const bytes = uuidToBytes(uuidv1());
    const id = Math.min(0xffffffff, Math.max(0, Number(document.getElementById('localId').value) || 0)) >>> 0;
    bytes[0] = (id >>> 24) & 255; bytes[1] = (id >>> 16) & 255; bytes[2] = (id >>> 8) & 255; bytes[3] = id & 255;
    bytes[6] = (bytes[6] & 0x0f) | 0x20;
    bytes[9] = Number(document.getElementById('localDomain').value) & 255;
    return bytesToUuid(bytes, 2);
  }

  function format(s) {
    const u = document.getElementById('upperChk').checked;
    const braces = document.getElementById('bracesChk').checked;
    const quotes = document.getElementById('quotesChk').checked;
    let out = u ? s.toUpperCase() : s;
    if (braces) out = `{${out}}`;
    if (quotes) out = `"${out}"`;
    return out;
  }

  async function generate() {
    const version = document.getElementById('versionSel').value;
    const deterministic = version === '3' || version === '5';
    const n = deterministic ? 1 : Math.min(200, Math.max(1, parseInt(document.getElementById('count').value, 10) || 10));
    const list = document.getElementById('list');
    list.innerHTML = '';
    try {
      for (let i = 0; i < n; i++) {
        const raw = version === '1' ? uuidv1() : version === '2' ? uuidv2() : deterministic ? await nameUuid(version) : uuidv4();
        const f = format(raw);
        const row = document.createElement('div');
        row.className = 'uuid-row';
        row.innerHTML = `<span>${i+1}.</span><span class="val">${f}</span><button class="btn copy" data-copy="${f}">复制</button>`;
        list.appendChild(row);
      }
    } catch (error) {
      list.innerHTML = `<div class="status-msg err">${error.message}</div>`;
    }
  }

  function syncVersionOptions() {
    const version = document.getElementById('versionSel').value;
    document.getElementById('v2Options').hidden = version !== '2';
    document.getElementById('nameOptions').hidden = version !== '3' && version !== '5';
    const count = document.getElementById('count');
    count.disabled = version === '3' || version === '5';
    document.getElementById('customNamespaceLabel').hidden = document.getElementById('namespacePreset').value !== 'custom';
  }

  function init() {
    document.getElementById('genBtn').addEventListener('click', generate);
    document.getElementById('copyAll').addEventListener('click', () => {
      const vals = [...document.querySelectorAll('.uuid-row .val')].map(e => e.textContent);
      window.copyText(vals.join('\n'), '已全部复制');
    });
    document.getElementById('list').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-copy]');
      if (b) window.copyText(b.dataset.copy, '已复制');
    });
    [document.getElementById('versionSel'), document.getElementById('count'),
     document.getElementById('upperChk'), document.getElementById('bracesChk'),
     document.getElementById('quotesChk'), document.getElementById('localDomain'),
     document.getElementById('localId'), document.getElementById('namespacePreset'),
     document.getElementById('customNamespace'), document.getElementById('nameValue')]
      .forEach(el => el.addEventListener('change', () => { syncVersionOptions(); generate(); }));
    syncVersionOptions();
    generate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
