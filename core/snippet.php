<?php
class Snippet {
  function buffer($snippet_id, $args, $root = null) {
    if($root === null) {
      $filepath = option('root.path') . '/snippets/' . $snippet_id . '.php';
    } else {
      $filepath = $root;
    }

    ob_start();
    if(isset($args)) {
      extract($args);
      unset($snippet_id, $args);
    }
    include $filepath;
    $contents = ob_get_contents();
    ob_end_clean();
    return $contents;
  }
}

function snippet($id, $args = [], $root = null) {
  $Snippet = new Snippet();
  return $Snippet->buffer($id, $args, $root);
}