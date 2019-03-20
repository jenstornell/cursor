<?php
$last = dirname($_SERVER['REQUEST_URI']);
$url = '//' . $_SERVER['HTTP_HOST'] . $last . '/';
$cookie_path = str_replace($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'], '', option('root.url')) . '/';

return [
  'path_users' => option('root.path') . '/users/',
  'path_temp' => option('root.path') . '/temp/',
  'setcookie_secure' => false,
  'prefill.password' => 'test',
  'prefill.username' => 'test@example.com',
  'redirect.url' => option('root.url'),
  'setcookie_path' => $cookie_path,
];