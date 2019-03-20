<?php
header("X-Frame-Options: sameorigin"); // Prevent iframe access
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff"); // Require correct MIME type for CSS and JS
header("Content-Security-Policy: default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';");
header("Referrer-Policy: no-referrer");

include __DIR__ . '/core/tinyoptions.php';
include __DIR__ . '/core/wall.php';
include __DIR__  . '/core/knock/knock.php';

include __DIR__ . '/../core/helpers.php';
include __DIR__ . '/../libraries/tinyrouter.php';

setOptions();

$options = include __DIR__ . '/options.php';

walloption::default([
  'key_cookie_username' => 'username',
  'key_cookie_hash' => 'hash',
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

$knock = new Knock(walloption());

if(isset($_GET['login'])) {
  if($knock->login()) {
    header(sprintf('Location: %s', walloption('redirect.url')));
    die;
  } else {
    header(sprintf('Location: %s', wall::url('?error')));
    die;
  }
} elseif(isset($_GET['logout'])) {
  $knock->logout();
  header(sprintf('Location: %s', wall::url()));
} else {
  include __DIR__ . '/core/templates/form.php';
}