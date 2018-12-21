<?php
if(isset($_POST['submit-delete-folder'])) {
  $folderpath = get::folderPath();
  $empty = (count(glob("$folderpath/*")) === 0) ? true : false;

  if(!file_exists($folderpath))
    $error = "Error! The folder doesn't exist!";
  elseif(!$empty)
    $error = 'Error! The folder is not empty!';
  elseif(!is_writable($folderpath))
    $error = "Error! You don't have permission to delete the folder!";
  elseif(!rmdir($folderpath))
    $error = "Error! The folder could not be deleted!";
  else {
    header("Location: " . get::folderParentUrl());
    die();
  }
}