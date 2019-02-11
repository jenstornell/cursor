<?php
$options = include __DIR__ . '/options.php';

include __DIR__ . '/core/helpers.php';
include __DIR__ . '/libraries/tinyoptions.php';
include __DIR__ . '/libraries/tinyrouter.php';
include __DIR__ . '/core/snippet.php';

option::default([
  'autosave' => true,
  'autosave.interval' => 15,
  'editor.width' => 900,
  'root.url' => null,
  'root.path' => null,
  'spellcheck' => false,
  'project.path' => null,
  'project.css' => null,
  'bar.top' => true,
  'bar.bottom' => true,
  'preview.width' => 900,
  'revisions.hide' => true,
  'revisions.folder' => 'revisions',
  'revisions.max' => 2,
  'sidebar.width' => 300,
]);

$options = flattenOptions($options);
$options = array_merge($tiny_options['default']['defaults'], $options);

option::set($options);

include __DIR__ . '/core/routes/file/add.php';
include __DIR__ . '/core/routes/file/image.php';
include __DIR__ . '/core/routes/file/read.php';
include __DIR__ . '/core/routes/file/rename.php';
include __DIR__ . '/core/routes/file/save.php';
include __DIR__ . '/core/routes/file/delete.php';
include __DIR__ . '/core/routes/file/upload.php';

include __DIR__ . '/core/routes/folder/add.php';
include __DIR__ . '/core/routes/folder/delete.php';
include __DIR__ . '/core/routes/folder/read.php';

echo snippet('home');