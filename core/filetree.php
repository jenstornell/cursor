<?php
include __DIR__ . '/helpers.php';
include __DIR__ . '/../login/core/knock/knock.php';
setOptions();

$options = include __DIR__ . '/../login/options.php';
$knock = new Knock($options);
$userdata = include($knock->getUserpath());

$post = json_decode(file_get_contents('php://input'), true);

$root = option('project.path');

$path = ($post['id'] == '/') ? '' : '/' . $post['id'];
$glob = glob($root . $path . '/*');
$data = [];

if($glob) {
  foreach($glob as $item) {
    $parts = pathinfo($item);
    $extension = '';
    if(isset($parts['extension'])) {
      $extension = $parts['extension'];
    }
    if(is_file($item)) {
      if(in_array($extension, option('filetypes'))) {
        $data[] = basename($item);
      }
    } elseif(is_dir($item)) {
      $allowed = true;

      if(isset($userdata['access']['folders'])) {
        $allowed = false;

        foreach($userdata['access']['folders'] as $folder) {
          $match = $root . '/' . $folder;
          if(substr($match, -1) == '*') {
            if(startsWith(substr($match, 0, -1), $item)) {
              $allowed = true;
            }
          }
        }
      }

      if(!$allowed) continue;

      $hide_revisions = option('revisions.hide');
      $is_revisions = option('revisions.folder') === basename($item);

      if($hide_revisions && $is_revisions) continue;
      $data[] = basename($item) . '/';
    }
  }
}

usleep(250000);

echo json_encode($data);