<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">

  <link rel="stylesheet" href="https://use.typekit.net/icu8dxn.css">
  
  <link rel="icon" href="edit.svg">

  <title>Markia</title>
  
  <link rel="stylesheet" href="<?= config::get('url'); ?>/assets/css/dist/style.min.css?time=<?= time(); ?>">

  <?php foreach(config::get('css') as $css) : ?>
    <link rel="stylesheet" href="<?= $css; ?>?time=<?= time(); ?>">
  <?php endforeach; ?>
</head>
<body data-toggle-trigger-off data-toggle-group="tabsGroup">