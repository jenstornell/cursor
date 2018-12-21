<?php
if(isset($_POST['submit-rename-folder'])) {
  $foldername = slug($_POST['folder-name']);
  $new_folderpath = path::folderParentPath() . '/' . $foldername;

  if(empty($foldername))
    $error = 'Error! You did not write a folder name!';
  elseif(file_exists($new_folderpath))
    $error = 'Error! The folder already exists!';
  elseif(!is_writable(path::folderPath()))
    $error = "Error! You don't have permission to rename the folder!";
  elseif(!rename(path::folderPath(), $new_folderpath))
    $error = "Error! The folder could not be renamed!";
  else {
    header("Location: " . url::folderParentUrl() . urlencode('/' . $foldername));
    die();
  }
}