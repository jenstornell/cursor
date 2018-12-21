function render(markdown) {
  html = marked(markdown);
  document.querySelector('#output').innerHTML = html;
}