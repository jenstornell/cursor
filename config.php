<?php
return [
  'root' => realpath(__DIR__ . '/../sites/vardagsfinans.se/content'),
  'revisions'  => [
    'folder' => '_my_revisions',
    'limit' => 5
  ],
  'users' => [
    'jens.tornell@gmail.com' => 'c87d6d320809465b6496c74e90dda50f'
  ],
  'url' => 'http://localhost/markia',
  'extensions' => [
    'markdown' => ['md', 'txt'],
    'image' => ['jpg', 'jpeg', 'png', 'gif']
  ],
  'css' => [
    'http://localhost/markia/assets/css/dist/input.min.css',
    'http://localhost/markia/assets/css/dist/output.min.css'
  ]
];