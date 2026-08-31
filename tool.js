(function (global) {
  'use strict';

  var CryptoJS = global.CryptoJS;
  var ClipboardJS = global.ClipboardJS;

  var B64ENC = { '+': '-', '/': '_', '=': '' };
  var B64DEC = { '-': '+', _: '/' };
  var NFKCTable = {
    upper: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
    lower: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'
  };

  function urlEncode(s) { return encodeURIComponent(s); }

  function urlAllEncode(s) {
    return unescape(encodeURIComponent(s)).replace(/[^]/g, function (ch) {
      return '%' + ch.charCodeAt().toString(16).padStart(2, '0');
    });
  }

  function urlDecode(s) {
    var t = s.replace(/%[a-fA-F0-9]{2}/gi, function (e) {
      return String.fromCharCode(parseInt(e.replace('%', ''), 16));
    });
    return decodeURIComponent(escape(t));
  }

  function base64Encode(s) { return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(s)); }

  function base64Decode(s) {
    s = s.replace(/[-_]/g, function (c) { return B64DEC[c]; });
    var parsed = CryptoJS.enc.Base64.parse(s);
    try { return CryptoJS.enc.Utf8.stringify(parsed); }
    catch (e) { return CryptoJS.enc.Latin1.stringify(parsed); }
  }

  function urlSafeBase64Encode(s) {
    return base64Encode(s).replace(/[+/=]/g, function (c) { return B64ENC[c]; });
  }

  function hexEncode(s) { return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(s)); }

  function hexDecode(s) {
    if (s.startsWith('0x') || s.startsWith('0X')) s = s.substr(2);
    var parsed = CryptoJS.enc.Hex.parse(s);
    try { return CryptoJS.enc.Utf8.stringify(parsed); }
    catch (e) { return CryptoJS.enc.Latin1.stringify(parsed); }
  }

  function html10Encode(s) {
    return s.split('').map(function (ch) {
      return '&#' + ch.charCodeAt().toString().padStart(2, '0') + ';';
    }).join('');
  }

  function htmlspecialchars(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function html10Decode(s) {
    return s.replace(/&#(\d+);?/g, function (_, d) { return String.fromCharCode(parseInt(d)); });
  }

  function html16Encode(s) {
    return s.split('').map(function (ch) {
      return '&#x' + ch.charCodeAt().toString(16).padStart(2, '0') + ';';
    }).join('');
  }

  function html16Decode(s) {
    return s.replace(/&#x([a-f0-9]+);?/gi, function (_, h) {
      return String.fromCharCode(parseInt(h, 16));
    });
  }

  function js8Encode(s) {
    return s.split('').map(function (ch) {
      return '\\' + ch.charCodeAt().toString(8).padStart(2, '0');
    }).join('');
  }

  function js8Decode(s) {
    return s.replace(/\\([0-7]+)/g, function (_, o) {
      return String.fromCharCode(parseInt(o, 8));
    });
  }

  function js16Encode(s) {
    return s.split('').map(function (ch) {
      return '\\x' + ch.charCodeAt().toString(16).padStart(2, '0');
    }).join('');
  }

  function js16Decode(s) {
    return s.replace(/\\x([a-f0-9]{1,4})/gi, function (_, h) {
      return String.fromCharCode(parseInt(h, 16));
    });
  }

  function NFKCEncode(s) {
    var out = [];
    for (var ch of s) {
      if (/[A-Z]/.test(ch)) out.push(NFKCTable.upper[ch.charCodeAt(0) - 65]);
      else if (/[a-z]/.test(ch)) out.push(NFKCTable.lower[ch.charCodeAt(0) - 97]);
      else out.push(ch);
    }
    return out.join('');
  }

  function unicodeEncode(s) {
    return s.split('').map(function (ch) {
      var pad = '0000';
      var hex = ch.charCodeAt().toString(16);
      return '\\u' + pad.substring(0, pad.length - hex.length) + hex;
    }).join('');
  }

  function unicodeDecode(s) {
    return s.replace(/\\u([a-fA-F0-9]{4})/g, function (_, h) {
      return String.fromCharCode(parseInt(h, 16));
    });
  }

  function stringCharCode(s) {
    return 'String.fromCharCode(' + s.split('').map(function (ch) {
      return ch.charCodeAt();
    }).join(',') + ')';
  }

  function evalCode(value) { return eval(value); }

  function javaBash(s) {
    return 'bash -c {echo,' + base64Encode(s) + '}|{base64,-d}|{bash,-i}';
  }

  function generateTime() {
    return Math.floor(new Date().getTime() / 1e3).toString();
  }

  function currentUA() { return navigator.userAgent; }

  var UA_LIST = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
    "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.58",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.116 YaBrowser/22.1.1.1544 Yowser/2.5 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 YaBrowser/22.1.0.2517 Yowser/2.5 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.175 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
  ];

  function generateUA() {
    return UA_LIST[Math.floor(Math.random() * UA_LIST.length)];
  }

  var ToolFunctions = {
    urlEncode: urlEncode,
    urlAllEncode: urlAllEncode,
    urlDecode: urlDecode,
    base64Encode: base64Encode,
    base64Decode: base64Decode,
    urlSafeBase64Encode: urlSafeBase64Encode,
    hexEncode: hexEncode,
    hexDecode: hexDecode,
    html10Encode: html10Encode,
    htmlspecialchars: htmlspecialchars,
    html10Decode: html10Decode,
    html16Encode: html16Encode,
    html16Decode: html16Decode,
    js8Encode: js8Encode,
    js8Decode: js8Decode,
    js16Encode: js16Encode,
    js16Decode: js16Decode,
    NFKCEncode: NFKCEncode,
    unicodeEncode: unicodeEncode,
    unicodeDecode: unicodeDecode,
    stringCharCode: stringCharCode,
    evalCode: evalCode,
    javaBash: javaBash,
    generateTime: generateTime,
    currentUA: currentUA,
    generateUA: generateUA,
    UA_LIST: UA_LIST
  };

  global.ToolFunctions = ToolFunctions;
  if (typeof module !== 'undefined' && module.exports) module.exports = ToolFunctions;

  var TRANSFORMS = [
    ['URL编码', 'urlEncode', 'encode'],
    ['URL全编码', 'urlAllEncode', 'encode'],
    ['URL解码', 'urlDecode', 'decode'],
    ['Base64编码', 'base64Encode', 'encode'],
    ['URL Safe Base64编码', 'urlSafeBase64Encode', 'encode'],
    ['Base64解码', 'base64Decode', 'decode'],
    ['Hex编码', 'hexEncode', 'encode'],
    ['Hex解码', 'hexDecode', 'decode'],
    ['Html10编码', 'html10Encode', 'encode'],
    ['Htmlspecialchars编码', 'htmlspecialchars', 'encode'],
    ['Html10解码', 'html10Decode', 'decode'],
    ['Html16编码', 'html16Encode', 'encode'],
    ['Html16解码', 'html16Decode', 'decode'],
    ['JS8编码', 'js8Encode', 'encode'],
    ['JS8解码', 'js8Decode', 'decode'],
    ['JS16编码', 'js16Encode', 'encode'],
    ['JS16解码', 'js16Decode', 'decode'],
    ['Unicode编码', 'unicodeEncode', 'encode'],
    ['Unicode解码', 'unicodeDecode', 'decode'],
    ['StringCharCode', 'stringCharCode', 'transform'],
    ['NFKCEncode', 'NFKCEncode', 'transform'],
    ['Java Bash', 'javaBash', 'transform'],
    ['直接执行', 'evalCode', 'danger']
  ];

  var UTILITIES = [
    ['当前时间戳', 'generateTime'],
    ['当前UA', 'currentUA'],
    ['随机UA', 'generateUA']
  ];

  var UTIL_ICONS = {
    generateTime: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/></svg>',
    currentUA: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="8" rx="1.5"/><path d="M6 13.5h4M8 11v2.5"/></svg>',
    generateUA: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h2.5c4 0 5 8 9 8H14"/><path d="M2 12h2.5c1.6 0 2.7-1.3 3.5-2.7M14 4h-.5c-2 0-3.2 1.3-4 2.7"/><path d="M12 2l2 2-2 2M12 10l2 2-2 2"/></svg>'
  };

  var COPY_ICON = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/></svg>';

  var datas = { 0: '' };
  var actionLog = {};

  function applyTransform(name, value) {
    try { return String(ToolFunctions[name](value)); }
    catch (e) { return String(e); }
  }

  function refreshDatas(n) {
    Object.keys(datas).map(function (k) {
      if (n < 0 && 0 === parseInt(k)) datas[0] = applyTransform(actionLog[n], datas[0]);
      if (parseInt(k) < n) return;
      if (void 0 === actionLog[k]) return;
      datas[parseInt(k) + 1] = applyTransform(actionLog[k], datas[k]);
    });
  }

  function labelOf(name) {
    for (var i = 0; i < TRANSFORMS.length; i++)
      if (TRANSFORMS[i][1] === name) return TRANSFORMS[i][0];
    return name;
  }

  function doAction(step, name) {
    if (step >= 0 && '' === datas[step]) return;
    actionLog[step] = name;
    refreshDatas(step);
    render();
    scrollToLastStep();
  }

  function scrollToLastStep() {
    var rows = rootEl.querySelectorAll('.step');
    if (rows.length) rows[rows.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  var rootEl = null;
  var prevKeys = {};

  function buildStepRow(step, isNew) {
    var row = document.createElement('div');
    row.className = 'step' + (isNew ? ' enter' : '');
    row.dataset.step = step;

    var num = document.createElement('span');
    num.className = 'step-num';
    num.textContent = parseInt(step, 10) + 1;
    row.appendChild(num);

    var card = document.createElement('div');
    card.className = 'step-card';

    var head = document.createElement('div');
    head.className = 'step-head';

    var title = document.createElement('span');
    title.className = 'step-title';
    if (parseInt(step, 10) > 0 && void 0 !== actionLog[step - 1]) {
      var badge = document.createElement('span');
      badge.className = 'step-badge';
      badge.textContent = labelOf(actionLog[step - 1]);
      title.appendChild(badge);
    } else {
      title.textContent = '输入';
    }
    head.appendChild(title);

    var meta = document.createElement('span');
    meta.className = 'step-meta';
    head.appendChild(meta);

    var copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'icon-btn';
    copy.innerHTML = COPY_ICON + '<span>复制</span>';
    attachClipboard(copy, function () { return datas[step] || ''; });
    head.appendChild(copy);

    card.appendChild(head);

    var ta = document.createElement('textarea');
    ta.rows = 5;
    ta.spellcheck = false;
    if ('0' === step) ta.placeholder = '输入或粘贴内容，转换按钮会出现在下方…';
    ta.value = datas[step];
    ta.addEventListener('input', function () {
      datas[step] = ta.value;
      refreshDatas(step);
      syncValues();
    });
    card.appendChild(ta);

    var actions = document.createElement('div');
    actions.className = 'actions';
    TRANSFORMS.forEach(function (item) {
      var label = item[0], name = item[1], type = item[2];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip t-' + type + (actionLog[step] === name ? ' on' : '');
      btn.innerHTML = '<i class="dot"></i>' + label;
      btn.addEventListener('click', function () { doAction(step, name); });
      actions.appendChild(btn);
    });
    card.appendChild(actions);

    var hint = document.createElement('div');
    hint.className = 'empty-hint';
    hint.textContent = '↑ 输入内容后，这里会出现编码 / 解码 / 变换按钮，转换结果会以新步骤追加';
    card.appendChild(hint);

    row.appendChild(card);
    return row;
  }

  function syncRow(row) {
    var step = row.dataset.step;
    var value = datas[step] || '';
    var rows = rootEl.querySelectorAll('.step');
    var isLast = row === rows[rows.length - 1];

    var meta = row.querySelector('.step-meta');
    if (meta) {
      meta.textContent = value
        ? Array.from(value).length + ' 字符 · ' + CryptoJS.enc.Utf8.parse(value).sigBytes + ' 字节'
        : '';
    }
    var actions = row.querySelector('.actions');
    if (actions) actions.classList.toggle('hidden', isLast && '' === value);
    var hint = row.querySelector('.empty-hint');
    if (hint) hint.classList.toggle('hidden', !(1 === rows.length && '' === value));
  }

  function render() {
    if (!rootEl) return;
    destroyClipboards();
    rootEl.textContent = '';
    var steps = Object.keys(datas).sort(function (a, b) { return a - b; });
    var newKeys = {};
    steps.forEach(function (step) {
      var isNew = !prevKeys[step];
      newKeys[step] = true;
      var row = buildStepRow(step, isNew);
      rootEl.appendChild(row);
      syncRow(row);
    });
    prevKeys = newKeys;
  }

  function syncValues() {
    if (!rootEl) return;
    var rows = rootEl.querySelectorAll('.step');
    for (var i = 0; i < rows.length; i++) {
      var step = rows[i].dataset.step;
      var ta = rows[i].querySelector('textarea');
      if (ta && ta.value !== datas[step]) ta.value = datas[step];
      syncRow(rows[i]);
    }
  }

  var clipboardPool = [];

  function attachClipboard(btn, getText) {
    var clip = new ClipboardJS(btn, { text: getText });
    clip.on('success', function () { toast('已成功复制数据'); });
    clip.on('error', function () {
      if (fallbackCopy(getText())) toast('已成功复制数据');
    });
    clipboardPool.push(clip);
  }

  function destroyClipboards() {
    clipboardPool.forEach(function (c) { c.destroy(); });
    clipboardPool = [];
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2000);
  }

  function init() {
    rootEl = document.getElementById('tool-root');
    if (!rootEl) return;

    var utilBar = document.getElementById('tool-utilities');
    if (utilBar) {
      UTILITIES.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip util';
        btn.innerHTML = (UTIL_ICONS[item[1]] || '') + item[0];
        btn.addEventListener('click', function () { doAction(-1, item[1]); });
        utilBar.appendChild(btn);
      });
    }

    var reset = document.getElementById('tool-reset');
    if (reset) reset.addEventListener('click', function () {
      datas = { 0: '' };
      actionLog = {};
      prevKeys = {};
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    render();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
