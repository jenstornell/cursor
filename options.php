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
  'autosave' => 50,
  'revisions' => [
    //'max' => false,
    'hide' => false
  ]
];