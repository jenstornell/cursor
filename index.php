<?php
include __DIR__ . '/core/helpers.php';
include __DIR__ . '/libraries/tinyrouter.php';
include __DIR__ . '/login/core/knock/knock.php';

setOptions();

$options = include __DIR__ . '/login/options.php';
$knock = new Knock($options);

if(!$knock->isLoggedIn()) {
  header('Location: ' . option('root.url') . '/login/');
  die;
}

$knock->keepAlive();

include __DIR__ . '/core/snippet.php';
include __DIR__ . '/core/routes/actions.php';
include __DIR__ . '/core/routes/image.php';

echo snippet('home');