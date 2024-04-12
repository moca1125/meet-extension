const scripts = [ 
  'tf-core.js', 
  'tf-converter.js',
  'tf-backend-webgl.js',
  'face-landmarks-detection.js',
  'lmMarkImg.js',
  'main.js', ];
(function loadSequentially() {
  const el = document.createElement('script')
  el.src = chrome.runtime.getURL(scripts.shift());
  if (scripts[0]) el.onload = loadSequentially;
  document.documentElement.appendChild(el);
  el.remove();
})();
