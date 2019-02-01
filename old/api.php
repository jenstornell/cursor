<?php
include 'lib/helpers.php';
include 'lib/config.php';
include 'lib/get.php';
include 'lib/post.php';
include 'lib/io.php';
include 'lib/path.php';
include 'lib/snippet.php';
include 'lib/url.php';
include 'lib/find.php';
include 'lib/login.php';
include 'lib/cookie.php';
include 'lib/explorer.php';
include 'lib/helpers-params.php';

$config = include 'config.php';
global $config;

$post = getPost();
global $post;

#var_dump($post);

include __DIR__ . '/lib/io/file-create.php';
include __DIR__ . '/lib/io/file-delete.php';
include __DIR__ . '/lib/io/file-rename.php';
include __DIR__ . '/lib/io/file-save.php';

include __DIR__ . '/lib/io/folder-create.php';
include __DIR__ . '/lib/io/folder-delete.php';
include __DIR__ . '/lib/io/folder-rename.php';

function getPost() {
  $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

  if($contentType === "application/json") {
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, true);

    if(!is_array($decoded)) return false;
    else
      return $decoded;
  }
}

switch($post['type']) {
  case 'rename':
    $json = json_encode([
      'folderpath' => 'companies%2F_my_revisions',
      'old_filename' => 'default',
      'new_filename' => 'something',
      'extension' => 'txt'
    ]);
    $FileRename = new fileRename();
    $FileRename->rename($json);
    break;
  case 'list':
      snippet('header');
      snippet('list/list');
    break;
}