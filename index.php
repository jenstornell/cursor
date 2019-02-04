<?php
$options = include __DIR__ . '/options.php';

include __DIR__ . '/core/helpers.php';
include __DIR__ . '/libraries/tinyoptions.php';
include __DIR__ . '/libraries/tinyrouter.php';
include __DIR__ . '/core/snippet.php';

$options = flattenOptions($options);
option::set($options);

include __DIR__ . '/core/routes/file/image.php';
include __DIR__ . '/core/routes/file/read.php';
include __DIR__ . '/core/routes/file/rename.php';
include __DIR__ . '/core/routes/file/save.php';

include __DIR__ . '/core/routes/folder/read.php';

echo snippet('home');