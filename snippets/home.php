<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

<?php /*
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&amp;text=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ%C3%85%C3%84%C3%96abcdefghijklmnopqrstuvwxyz%C3%A5%C3%A4%C3%B6%C3%A9+-%21%3F%22%2C.%25%2F%28%29%40%26" rel="stylesheet">
  */
  ?>
  
  <link rel="icon" href="">

  <title>Markia</title>
  
  <link rel="stylesheet" href="<?= option('root.url'); ?>/assets/css/dist/style.css?t=<?= time(); ?>">
  <link rel="stylesheet" href="<?= option('project.css', option('root.url') . '/assets/css/dist/preview.css?t=' . time()); ?>">

  <?php
    $preview_width = '[data-preview-width] { max-width: ' . option('preview.width') . 'px; }';
    $editor_width = '[data-editor-width] { max-width: ' . option('editor.width') . 'px; }';
    $sidebar_width = 'aside { width: ' . option('sidebar.width') . 'px; }';
  ?>

  <?= '<style>' . $preview_width . $editor_width . $sidebar_width . '</style>'; ?>
</head>
<body data-state="welcome" data-staircase-selector="stair-case">
  <div class="pending"></div>
  <?= snippet('aside'); ?>
  <main>
    <?= snippet('topbar'); ?>
    <div class="split state">
      <?= snippet('editor'); ?>
      <?= snippet('preview'); ?>
    </div>
    <div class="welcome state">
      <h1>Welcome to Markia!</h1>
      <p>Select a markdown file to get started!</p>
    </div>
    <div class="browser state">
    </div>
    <div class="image state">
      <figure>
        <img src="">
      </figure>
    </div>
    <?= snippet('bottombar'); ?>
  </main>

<?php
$json = json_encode(option());
?>

<script src="<?= option('root.url'); ?>/assets/js/dist/script.js?t=<?= time(); ?>"></script>
<script>
  var latest = '';
  var action = '';
  var buffer_id = '';

  let options = <?= $json; ?>;
  let fullscreen = new Fullscreen();
  let render = new Render();
  let save = new Save({
    render: render,
    root: '<?= option('root.url'); ?>',
    options: options,
  });
  let fileread = new FileRead({
    render: render,
    root: '<?= option('root.url'); ?>',
  });
  let folderread = new FolderRead({
    render: render,
    fileread, fileread,
    root: '<?= option('root.url'); ?>',
  });
  let filerename = new FileRename({
    render: render,
    root: '<?= option('root.url'); ?>',
    options: options,
  });

  let filedelete = new FileDelete({
    render: render,
    root: '<?= option('root.url'); ?>',
    //options: options,
  });

  save.init();
  filerename.init();
  filedelete.init();

  document.addEventListener("DOMContentLoaded", (event) => {
    fullscreen.init();
  });

  class StaircaseCallbacks {
    load(params) {
      //console.log(params);
      console.log('test');
    }
    toggle(params) {
      if(action === 'folder/read' && params.id === buffer_id) {
        console.log(buffer_id);
        staircase.select(buffer_id, 'folder');
      }
      //console.log(params);
    }
    select(args) {
      //console.log(args);
      if(args.type == 'file') {
        fileread.get(args.id);
      } else if(args.type == 'folder') {
        folderread.get(args.id);
      }
    }
  }
  render.init();
</script>
</body>
</html>