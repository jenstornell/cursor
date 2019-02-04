<?php
route('api/image/:all', function($matches) {
  $path = option('project.path') . '/' . $matches[1];
  $extension = pathinfo($path, PATHINFO_EXTENSION);

  switch($extension) {
    case "gif":
      $ctype="image/gif";
      break;
    case "png":
      $ctype="image/png";
      break;
    case "jpeg":
    case "jpg":
      $ctype="image/jpeg";
      break;
    default:
  }

  header('Content-type: ' . $ctype);

  echo file_get_contents($path);
  die;
});