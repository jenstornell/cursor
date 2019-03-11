<?php
include __DIR__ . '/core/tinyoptions.php';
include __DIR__ . '/core/wall.php';
include __DIR__  . '/core/knock/knock.php';

$options = include __DIR__ . '/options.php';

walloption::default([
  'redirect.url' => wall::url(),
  'text.username' => 'Username',
  'text.password' => 'Password',
  'text.login' => 'Login',
  'text.login.success' => 'You are logged in as',
  'text.login.unauthorized' => 'Username or password was wrong. Try again!',
  'text.login.error' => 'Something went wrong. Try again!',
  'text.logout' => 'Logout',
  'text.visit' => 'Visit'
]);

walloption::set($options);

if(isset($_GET['login'])) {
  $_POST = json_decode(file_get_contents('php://input'), true);
  echo json_encode(['success' => knock::login()]);
} elseif(isset($_GET['logout'])) {
  knock::logout();
  header(sprintf('Location: %s', wall::url()));
} else {
  include __DIR__ . '/core/templates/form.php';
}