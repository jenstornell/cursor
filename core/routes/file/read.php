<?php
route('api/file/read', function() {
  include option('root.path') . '/core/actions/file/read.php';

  $post = post();

  $file_read = new FileRead($post['id']);
  $file_read->read();
  die;
});