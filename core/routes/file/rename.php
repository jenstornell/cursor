<?php
route('api/file/rename', function() {
  include option('root.path') . '/core/actions/file/rename.php';

  $post = post();

  $file_rename = new FileRename($post['id'], $post['filename']);
  $file_rename->rename();
  die;
});