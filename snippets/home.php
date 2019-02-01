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
    $preview_width = '[data-preview-width] { max-width: ' . option('preview.width', 900) . 'px; }';
    $editor_width = '[data-editor-width] { max-width: ' . option('preview.width', 900) . 'px; }';
  ?>

  <?= '<style>' . $preview_width . $editor_width . '</style>'; ?>
</head>
<body data-state="welcome">
  <div class="pending"></div>
  <?= snippet('aside'); ?>
  <main>
    <?= snippet('topbar'); ?>
    <div class="split">
      <?= snippet('editor'); ?>
      <?= snippet('preview'); ?>
    </div>
    <div class="welcome">
      <h1>Welcome to Markia!</h1>
      <p>Select a markdown file to get started!</p>
    </div>
    <div class="browser">
    </div>
    <div class="image">
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

  let options = <?= $json; ?>;
  let fullscreen = new Fullscreen();
  let render = new Render();
  let message = new Message();
  let save = new Save({
    render: render,
    root: '<?= option('root.url'); ?>',
    options: options,
  });
  let fileread = new FileRead({
    render: render,
    root: '<?= option('root.url'); ?>',
    message: message,
  });
  let folderread = new FolderRead({
    render: render,
    root: '<?= option('root.url'); ?>',
    message: message,
  });
  message.init();
  save.init();

  document.addEventListener("DOMContentLoaded", (event) => {
    fullscreen.init();
  });

  console.log('<?= option('root.url'); ?>/core/filetree.php');

  staircase({
    ajaxPath: '<?= option('root.url'); ?>/core/filetree.php',
    selector: 'stair-case',
    callbacks: {
      select: function(args) {
        if(args.type == 'file') {
          fileread.get(args.id);
        } else if(args.type == 'folder') {
          folderread.get(args.id);
        }
      },
      load: function(args) {
        console.log('test');
        console.log(args);
      },
      toggle: function(args) {
        console.log(args);
      }
    }
  });
  render.init();
</script>
</body>
</html>