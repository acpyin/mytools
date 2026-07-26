(() => {
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const status = document.getElementById('status');
  const setStatus = (s, c = '') => { status.textContent = s; status.className = 'status-msg ' + c; };

  function elementToValue(el) {
    const result = {};
    if (el.attributes.length) {
      result['@attributes'] = {};
      for (const attr of el.attributes) result['@attributes'][attr.name] = attr.value;
    }

    const children = [...el.children];
    const text = [...el.childNodes]
      .filter(n => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.CDATA_SECTION_NODE)
      .map(n => n.nodeValue)
      .join('')
      .trim();

    if (text || !children.length) result._text = text;
    for (const child of children) {
      const value = elementToValue(child);
      if (result[child.tagName] === undefined) result[child.tagName] = value;
      else if (Array.isArray(result[child.tagName])) result[child.tagName].push(value);
      else result[child.tagName] = [result[child.tagName], value];
    }
    return result;
  }

  function xmlToObject(source) {
    const doc = new DOMParser().parseFromString(source, 'application/xml');
    const error = doc.querySelector('parsererror');
    if (error) throw new Error(error.textContent.replace(/\s+/g, ' ').trim());
    if (!doc.documentElement) throw new Error('XML 中没有根元素');
    return { [doc.documentElement.tagName]: elementToValue(doc.documentElement) };
  }

  function assertXmlName(name) {
    if (!/^[A-Za-z_][\w.:-]*$/.test(name)) throw new Error(`无效的 XML 名称：${name}`);
  }

  function appendValue(doc, parent, value) {
    if (value === null || value === undefined) return;
    if (typeof value !== 'object') {
      parent.appendChild(doc.createTextNode(String(value)));
      return;
    }

    const attrs = value['@attributes'];
    if (attrs !== undefined) {
      if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs)) {
        throw new Error('@attributes 必须是对象');
      }
      for (const [name, attrValue] of Object.entries(attrs)) {
        assertXmlName(name);
        parent.setAttribute(name, String(attrValue));
      }
    }
    if (value._text !== undefined) parent.appendChild(doc.createTextNode(String(value._text)));

    for (const [name, child] of Object.entries(value)) {
      if (name === '@attributes' || name === '_text') continue;
      assertXmlName(name);
      const values = Array.isArray(child) ? child : [child];
      for (const item of values) {
        const el = doc.createElement(name);
        appendValue(doc, el, item);
        parent.appendChild(el);
      }
    }
  }

  function objectToXml(value, requestedRoot) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('JSON 顶层必须是对象');
    }
    const keys = Object.keys(value);
    const rootName = requestedRoot || keys[0] || 'root';
    assertXmlName(rootName);
    const rootValue = requestedRoot ? value : value[rootName];
    const doc = document.implementation.createDocument('', rootName, null);
    appendValue(doc, doc.documentElement, rootValue);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(doc.documentElement);
  }

  function init() {
    document.getElementById('xmlToJsonBtn').addEventListener('click', () => {
      try {
        right.value = JSON.stringify(xmlToObject(left.value), null, 2);
        setStatus('✓ 已转换', 'ok');
      } catch (e) { setStatus('失败：' + e.message, 'err'); }
    });
    document.getElementById('jsonToXmlBtn').addEventListener('click', () => {
      try {
        const value = JSON.parse(left.value);
        const root = (document.getElementById('rootChk').checked && document.getElementById('rootName').value.trim()) || null;
        right.value = objectToXml(value, root);
        setStatus('✓ 已转换', 'ok');
      } catch (e) { setStatus('失败：' + e.message, 'err'); }
    });
    document.getElementById('rootChk').addEventListener('change', (e) => {
      document.getElementById('rootName').style.display = e.target.checked ? 'inline-block' : 'none';
    });
    document.getElementById('swapBtn').addEventListener('click', () => {
      const value = left.value; left.value = right.value; right.value = value;
    });
    document.getElementById('copyR').addEventListener('click', () => window.copyText(right.value, '已复制'));
    document.getElementById('clearBtn').addEventListener('click', () => {
      left.value = ''; right.value = ''; setStatus('');
    });
    document.getElementById('sampleBtn').addEventListener('click', () => {
      left.value = '<root><user id="1"><name>Alice</name><age>30</age></user><user id="2"><name>Bob</name><age>25</age></user></root>';
      document.getElementById('xmlToJsonBtn').click();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
