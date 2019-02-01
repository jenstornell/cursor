<?php
$parts = pathinfo($filepath);
$new_folder = $parts['dirname'] . '/' . option('revisions.folder', 'revisions');
$new_filepath = $new_folder . '/' . $parts['filename'] . '.' . time() . '';
$revisions_max = option('revisions.max', 2);

if($revisions_max) {
  if(!file_exists($new_folder)) {
    if(!is_writable($parts['dirname'])) {
      $success = false;
      $message = "Error! You don't have permission to create revision folder!";
    } elseif(mkdir($new_folder, 0755, false) === false) {
      $success = false;
      $message = "Error! The revision folder could not be added!";
    }
  }

  if(!file_exists($filepath)) {
    $success = false;
    $message = 'Error! Original file does not exist!';
  } elseif(file_put_contents($new_filepath, $post['text']) === false) {
    $success = false;
    $message = "Error! The revision could not be saved!";
  } elseif(file_get_contents($new_filepath) !== $post['text']) {
    $success = false;
    $message = "Error! Revision is not equal to the input!";
  }

  if(file_exists($new_folder)) {
    $files = array_filter(glob($new_folder . "/*"), 'is_file');
    array_multisort(array_map('filemtime', $files), SORT_NUMERIC, SORT_DESC, $files);
    $files = array_slice($files, $revisions_max);
    foreach($files as $file) {
      if(file_exists($file)) {
        unlink($file);
      }
    }
  }
}