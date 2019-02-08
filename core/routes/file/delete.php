<?php
route('api/file/delete', function() {
  include option('root.path') . '/core/actions/file/delete.php';

  $post = post();

  $file_delete = new FileDelete($post['id']);
  $file_delete->delete();
  die;
});