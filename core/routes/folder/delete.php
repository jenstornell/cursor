<?php
route('api/folder/delete', function() {
  include option('root.path') . '/core/actions/folder/delete.php';

  $post = post();

  $folder_delete = new FolderDelete($post['id']);
  $folder_delete->delete();
  die;
});