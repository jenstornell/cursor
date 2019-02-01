<?php
$glob = glob($root . '/*');
$files = array_filter($glob, 'is_file');
$folders = array_filter($glob, 'is_dir');
?>

<ul>
  <?php foreach($folders as $path) : ?>
    <li>
      <img src="<?= option('root.url'); ?>/assets/images/folder-solid.svg">
      <div class="filename"><?= basename($path); ?></div>
    </li>
  <?php endforeach; ?>

  <?php foreach($files as $path) : ?>
  <?php
  $extension = pathinfo($path)['extension'];
  $part = str_replace(option('root.path'), '', $path);
  echo $part;
  ?>
    <li>
      <?php if(in_array($extension, filetypes::image())) : ?>
        <figure>
          <img src="<?= option('root.url'); ?>/api/image<?= $part; ?>">
        </figure>
      <?php else : ?>
        <img src="<?= option('root.url'); ?>/assets/images/file-regular.svg">
      <?php endif; ?>
      <div class="filename"><?= basename($path); ?></div>
      <div class="filesize"><?= humanFilesize(filesize($path)); ?></div>
    </li>
  <?php endforeach; ?>
</ul>