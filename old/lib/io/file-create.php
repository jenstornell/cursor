<?php
if(isset($_POST['submit-create-file'])) {
  $new_filename = slug($_POST['name']) . '.md';
  $new_filepath = path::folderPath() . '/' . $new_filename;

  if(empty($_POST['name']))
    $error = 'Error! You did not write a filename!';
  elseif(file_exists($new_filepath))
    $error = 'Error! The file already exists!';
  elseif(!is_writable(path::folderPath()))
    $error = "Error! You don't have permission to add the file!";
  elseif(file_put_contents($new_filepath, '') === false)
    $error = "Error! The file could not be added!";
  else {
    header("Location: " . url::folderUrl() . '&file=' . $new_filename);
    die();
  }
}