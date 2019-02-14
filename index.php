<?php
$options = include __DIR__ . '/options.php';

include __DIR__ . '/core/helpers.php';
include __DIR__ . '/libraries/tinyoptions.php';
include __DIR__ . '/libraries/tinyrouter.php';
include __DIR__ . '/core/snippet.php';

option::default([
  'autosave' => true,
  'autosave.interval' => 15,
  'bar.bottom' => true,
  'bar.top' => true,
  'editor.width' => 900,
  'project.css' => null,
  'project.path' => null,
  'preview.width' => 900,
  'root.path' => null,
  'root.url' => null,
  'revisions.folder' => 'revisions',
  'revisions.hide' => true,
  'revisions.max' => 2,
  'sidebar.width' => 300,
  'spellcheck' => false,
]);

$options = flattenOptions($options);
$options = array_merge($tiny_options['default']['defaults'], $options);

option::set($options);

include __DIR__ . '/core/routes/actions.php';
include __DIR__ . '/core/routes/image.php';

echo snippet('home');