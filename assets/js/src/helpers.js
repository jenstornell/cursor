function $(selector, base = null) {
  base = (base === null) ? document : base;
  return base.querySelector(selector);
}

function $$(selector, base = null) {
  base = (base === null) ? document : base;
  return base.querySelectorAll(selector);
}

function dblclick(el) {
  let e = new MouseEvent('dblclick', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  el.dispatchEvent(e);
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}