<?php
if(isset($_POST['submit-create-folder'])) {
  $new_folderpath = path::folderPath() . '/' . slug($_POST['name']);

  if(empty($_POST['name']))
    $error = 'Error! You did not write a folder name!';
  elseif(file_exists($new_folderpath))
    $error = 'Error! The folder already exists!';
  elseif(!is_writable(path::folderPath()))
    $error = "Error! You don't have permission to add the folder!";
  elseif(mkdir($new_folderpath, 0755, false) === false)
    $error = "Error! The folder could not be added!";
}