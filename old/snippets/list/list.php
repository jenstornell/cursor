<?php
global $post;
$data = $post;

if(empty($post)) {
  $data = json_decode(json_encode([
    'folderpath' => [
        'companies',
        '_my_revisions',
    ],
    'filename' => 'default.txt'
  ]));
}

?>
<widget-explorer>
  <?php
    snippet('list/back', $data);
    snippet('list/current', $data);
    snippet('list/folders', $data);
    snippet('list/files', $data);
  ?>
</widget-explorer>