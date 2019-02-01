<?php
if(isset($_POST['submit-file-save'])) {
  $folderpath = path::folderPath();
  $new_folderpath = path::revisions();
  $new_subfolderpath = path::revisionFolder();
  $new_filepath = $new_subfolderpath . '/' . time() . '.md';

  $filepath = path::filePath();

  // Create revisions folder
  if(!file_exists($new_folderpath)) {
    if(!is_writable($folderpath))
      $error = "Error! You don't have permission to create revisions folder!";
    elseif(mkdir($new_folderpath, 0755, false) === false)
      $error = "Error! The revisions folder could not be added!";
  }

  // Create revision folder
  if(!$error) {
    if(!file_exists($new_subfolderpath)) {
      if(!is_writable($new_folderpath))
        $error = "Error! You don't have permission to create revision folder!";
      elseif(mkdir($new_subfolderpath, 0755, false) === false)
        $error = "Error! The revision folder could not be added!";
    }
  }

  // Create revision file
  if(!$error) {
    if(!file_exists($filepath))
      $error = "Error! The file doesn't exists!";
    elseif(!is_writable($new_subfolderpath))
      $error = "Error! You don't have permission to create the revision file!";
    elseif(file_put_contents($new_filepath, $_POST['input']) === false)
      $error = "Error! The revision file could not be added!";
  }

  // Save original file
  if(!$error) {
    if(!file_exists($new_filepath))
      $error = "Error! The revision file doesn't exists!";
    elseif(!is_writable($filepath))
      $error = "Error! You don't have permission to save the file!";
    elseif(file_put_contents($filepath, $_POST['input']) === false)
      $error = "Error! The file could not be saved!";
  }

  // Clean up revisions
  if(!$error) {
    if(file_exists($new_subfolderpath)) {
      $files = array_filter(glob($new_subfolderpath . "/*"), 'is_file');
      array_multisort(array_map('filemtime', $files), SORT_NUMERIC, SORT_DESC, $files);
      $files = array_slice($files, config::revisionsLimit());

      foreach($files as $file) {
        if(file_exists($file))
          unlink($file);
      }
    }
  }

  #echo "#" . $error . "#";
}