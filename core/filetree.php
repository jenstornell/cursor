<?php
include __DIR__ . '/helpers.php';
setOptions();

$post = json_decode(file_get_contents('php://input'), true);

$root = option('project.path');

$path = ($post['id'] == '/') ? '' : '/' . $post['id'];
$glob = glob($root . $path . '/*');

if($glob) {
  foreach($glob as $item) {
    $parts = pathinfo($item);
    $extension = '';
    if(isset($parts['extension'])) {
      $extension = $parts['extension'];
    }
    if(is_file($item)) {
      if(in_array($extension, filetypes::markdown()) || in_array($extension, filetypes::image())) {
        $data[] = basename($item);
      }
    } elseif(is_dir($item)) {
      $hide_revisions = option('revisions.hide');
      $is_revisions = option('revisions.folder') === basename($item);

      if($hide_revisions && $is_revisions) continue;
      $data[] = basename($item) . '/';
    }
  }
}

usleep(250000);

echo json_encode($data);