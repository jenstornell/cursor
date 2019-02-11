<?php
route('api/file/add', function() {
  include option('root.path') . '/core/actions/file/add.php';

  $post = post();

  $file_add = new FileAdd($post['id']);
  $file_add->add();
  die;
});