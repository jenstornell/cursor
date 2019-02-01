<?php
route('api/file/save', function() {
  include option('root.path') . '/core/actions/file/save.php';
  //include option('root.path') . '/core/ajax/file-revision.php';

  $post = post();

  $file_save = new FileSave($post);
  $file_save->save();
  die;
});