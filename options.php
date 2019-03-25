<?php
return include __DIR__ . '/options-test.php';
return [
  'root.url' => 'https://example.com',
  'root.path' => __DIR__,
  'spellcheck' => false,
  'project' => [
    'path' => __DIR__ . '/test',
    //'css' => 'asda'
  ],
  'bar' => [
    //'top' => false,
    //'bottom' => false
  ],
  'background_color' => '#000',
  'autosave' => 50,
  'revisions' => [
    'max' => 2,
    'hide' => true
  ],
  'login' => [
    'setcookie_secure' => false,
  ]
];