<script src="<?= config::get('url'); ?>/assets/js/dist/lib.min.js?time=<?= time(); ?>"></script>
<script src="<?= config::get('url'); ?>/assets/js/dist/custom.min.js?time=<?= time(); ?>"></script>

<script>
  /*var editor = CodeMirror.fromTextArea(document.querySelector("#input textarea"), {
    mode:  "markdown",
    lineWrapping: true,
    extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
  });

  editor.on("change", function() {
    render(editor.getValue());
  });

  document.addEventListener("DOMContentLoaded", function() {
    render(editor.getValue());
  });*/
</script>

<script>
var root = '<?= config::get('url'); ?>';
var useHash = true;
var hash = '#!';
var router = new Navigo(root, useHash, hash);

var type = window.location.hash.substr(3);

router
  .on(function() {
    json = JSON.stringify({
      'type': 'list',
      'path' : ''
    });

   ajax(root, json, 'loadList');
  }).
  on({
    '*': function(params) {
      //setContent('Products');

      json = JSON.stringify({
        'type': 'list',
        'path' : params.path
      });

      ajax(root, json, 'loadList');
    }
  })
  .resolve();

</script>

</body>
</html>