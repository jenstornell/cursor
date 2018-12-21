function loadList(html) {
  document.querySelector('ajax-explorer').innerHTML = html;

  var folders = document.querySelectorAll('widget-explorer .folders li');
  for(i=0; i<folders.length; i++) {
    var current = folders[i];
    current.addEventListener("click", function() {
      router.navigate('/' + this.dataset.path);
    });
  }
}