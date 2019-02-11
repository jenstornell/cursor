<?php
route('api/folder/add', function() {
  include option('root.path') . '/core/actions/folder/add.php';

  $post = post();

  $folder_add = new FolderAdd($post['id']);
  $folder_add->add();
  die;
});