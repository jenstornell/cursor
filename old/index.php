<?php
include 'lib/snippet.php';
include 'lib/helpers.php';
include 'lib/config.php';
include 'lib/get.php';
include 'lib/post.php';
include 'lib/io.php';
include 'lib/path.php';
include 'lib/url.php';
include 'lib/find.php';
include 'lib/login.php';
include 'lib/cookie.php';
include 'lib/helpers-params.php';

$config = include 'config.php';
global $config;

$error = false;
global $error;

include __DIR__ . '/lib/io/file-create.php';
include __DIR__ . '/lib/io/file-delete.php';
include __DIR__ . '/lib/io/file-rename.php';
include __DIR__ . '/lib/io/file-save.php';

include __DIR__ . '/lib/io/folder-create.php';
include __DIR__ . '/lib/io/folder-delete.php';
include __DIR__ . '/lib/io/folder-rename.php';

if(login::isValidMatch()) {
  snippet('page');
} else {
  header("Location: " . config::get('url') . '/login.php');
  die;
}