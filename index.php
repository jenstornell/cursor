<?php
include __DIR__ . '/core/helpers.php';
include __DIR__ . '/libraries/tinyrouter.php';
include __DIR__ . '/login/core/knock/knock.php';

setOptions();

if(!knock::isLoggedIn()) {
  header('Location: ' . option('root.url') . '/login/');
  die;
}

include __DIR__ . '/core/snippet.php';
include __DIR__ . '/core/routes/actions.php';
include __DIR__ . '/core/routes/image.php';

echo snippet('home');