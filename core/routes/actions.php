<?php
option::set('.route.path', option('.root.path') . '/core/actions');
option::set('.route.post', post());

routes([
  'api/file/add' => function() {
    include option('.route.path') . '/file/add.php';
    (new FileAdd(option('.route.post')['id']))->add();
    die;
  },
  'api/file/delete' => function() {
    include option('.route.path') . '/file/delete.php';
    (new FileDelete(option('.route.post')['id']))->delete();
    die;
  },
  'api/file/read' => function() {
    include option('.route.path') . '/file/read.php';
    (new FileRead(option('.route.post')['id']))->read();
    die;
  },
  'api/file/rename' => function() {
    include option('.route.path') . '/file/rename.php';
    (new FileRename(option('.route.post')['id'], option('.route.post')['filename']))->rename();
    die;
  },
  'api/file/save' => function() {
    include option('.route.path') . '/file/save.php';
    include option('.route.path') . '/file/revision.php';
  
    $file_revision = new FileRevision(option('.route.post'));
    $file_save = new FileSave(option('.route.post'));

    $file_revision->save();
    $file_save->save();
    echo $file_save->get();
    die;
  },
  'api/file/upload' => function() {
    include option('.route.path') . '/file/upload.php';
    (new FileUpload($_POST['id'], $_POST['overwrite']))->upload();
    die;
  },
  'api/folder/add' => function() {
    include option('.route.path') . '/folder/add.php';
    (new FolderAdd(option('.route.post')['id']))->add();
    die;
  },
  'api/folder/delete' => function() {
    include option('.route.path') . '/folder/delete.php';
    (new FolderDelete(option('.route.post')['id']))->delete();
    die;
  },
  'api/folder/read' => function() {
    include option('.route.path') . '/folder/read.php';
    (new FolderRead(option('.route.post')['id']))->read();
    die;
  },
  'api/folder/rename' => function() {
    include option('.route.path') . '/folder/rename.php';
    (new FolderRename(option('.route.post')['id'], option('.route.post')['filename']))->rename();
    die;
  }
]);