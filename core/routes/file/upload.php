<?php
route('api/file/upload', function() {
  include option('root.path') . '/core/actions/file/upload.php';

  $post = post();

  var_dump($post);

  $file_upload = new FileUpload();
  $file_upload->upload();
  die;
});