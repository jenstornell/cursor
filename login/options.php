<?php
$last = dirname($_SERVER['REQUEST_URI']);
$url = '//' . $_SERVER['HTTP_HOST'] . $last . '/';

return [
  'path.users' => __DIR__ . '/../users/',
  'path.temp' => __DIR__ . '/../temp/',
  /*'callback.login' => function($success) {
    echo json_encode(['success' => $success]);
  },*/
  'redirect.url' => $url,
];