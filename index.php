<?php
include __DIR__ . '/core/helpers.php';
include __DIR__ . '/libraries/tinyrouter.php';

setOptions();

include __DIR__ . '/core/snippet.php';
include __DIR__ . '/core/routes/actions.php';
include __DIR__ . '/core/routes/image.php';

echo snippet('home');