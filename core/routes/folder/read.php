<?php
route('api/folder/read', function() {
  include option('root.path') . '/core/actions/folder/read.php';

  $post = post();

  $folder_read = new FolderRead($post['id']);
  $folder_read->read();
  die;
});