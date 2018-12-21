<?php
if(isset($_POST['submit-delete-file'])) {
  $filepath = path::filePath();

  if(!file_exists($filepath))
    $error = "Error! The file doesn't exists!";
  elseif(!is_writable($filepath))
    $error = "Error! You don't have permission to delete the file!";
  elseif(!unlink($filepath))
    $error = 'Error! The file could not be deleted!';
  else {
    $revision_folder = path::revisionFolder();

    if(file_exists($revision_folder)) {
      foreach(glob($revision_folder . '/*') as $file) {
        if(is_writable($file))
          unlink($file);
      }

      $empty = (count(glob("$revision_folder/*")) === 0) ? true : false;

      if(is_writable($revision_folder) && $empty)
        rmdir($revision_folder);
    }

    header("Location: " . url::folderUrl());
    die();
  }
}