<?php
$last = dirname($_SERVER['REQUEST_URI']);
$url = '//' . $_SERVER['HTTP_HOST'] . $last . '/';
$cookie_path = str_replace($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'], '', option('root.url')) . '/';

$cursor_defaults = [
  'path_users' => option('root.path') . '/users/',
  'path_temp' => option('root.path') . '/temp/',
  'setcookie_secure' => false, // Not needed?
  'redirect.url' => option('root.url'),
  'setcookie_path' => $cookie_path,
];

$cursor_options = include __DIR__ . '/../options.php';
$login_options = array_merge($cursor_defaults, $cursor_options['login']);

return $login_options;