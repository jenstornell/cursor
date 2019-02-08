<?php
route('api/file/save', function() {
  include option('root.path') . '/core/actions/file/save.php';
  include option('root.path') . '/core/actions/file/revision.php';

  $post = post();

  $file_save = new FileSave($post);
  $file_revision = new FileRevision($post);

  $file_save->save();
  echo $file_save->get();

  $file_revision->save();
  die;
});