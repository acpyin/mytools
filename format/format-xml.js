(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s,c='') => { status.textContent=s; status.className='status-msg '+c; };
  const indent = () => parseInt(document.getElementById('indentSel').value,10) || 4;

  function formatXML(s) {
    const tab = ' '.repeat(indent());
    let out = '';
    let depth = 0;
    let i = 0;
    const src = s.replace(/>\s+</g, '><').trim();
    while (i < src.length) {
      if (src[i] === '<') {
        const end = src.indexOf('>', i);
        if (end === -1) throw new Error(`位置 ${i + 1} 的标签缺少 >`);
        const tag = src.slice(i, end + 1);
        // self-closing or comment/declaration/processing
        if (tag.startsWith('<?') || tag.startsWith('<!') || tag.endsWith('/>')) {
          out += tab.repeat(depth) + tag + '\n';
        } else if (tag.startsWith('</')) {
          depth = Math.max(0, depth - 1);
          out += tab.repeat(depth) + tag + '\n';
        } else {
          // check if it's closed right away <a>b</a>
          out += tab.repeat(depth) + tag;
          // peek ahead for inline closing
          const rest = src.slice(end + 1);
          const closeMatch = rest.match(/^([^<]*)<\/(\w+)>/);
          if (closeMatch && closeMatch[2] === tag.replace(/<(\w+).*/, '$1')) {
            out += closeMatch[1] + closeMatch[0].slice(closeMatch[1].length);
            out += '\n';
            i = end + 1 + closeMatch[0].length;
            continue;
          }
          out += '\n';
          depth++;
        }
        i = end + 1;
      } else i++;
    }
    return out.replace(/\n{2,}/g, '\n').trim();
  }

  function format() {
    if (!left.value.trim()) { right.value=''; return; }
    try { right.value = formatXML(left.value); setStatus('✓ 已美化', 'ok'); }
    catch (e) { setStatus('失败：'+e.message, 'err'); }
  }
  function minify() {
    right.value = left.value.replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim();
    setStatus('✓ 已压缩','ok');
  }
  function init() {
    document.getElementById('formatBtn').addEventListener('click', format);
    document.getElementById('minifyBtn').addEventListener('click', minify);
    document.getElementById('swapBtn').addEventListener('click', () => { const t=left.value; left.value=right.value; right.value=t; });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value,'已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => { left.value=''; right.value=''; setStatus(''); });
    document.getElementById('sampleBtn').addEventListener('click', () => { left.value='<a><b>1</b><c>2</c></a>'; format(); });
    left.value='<root><user id="1"><name>Alice</name><tags><tag>a</tag><tag>b</tag></tags></user></root>';
    format();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
