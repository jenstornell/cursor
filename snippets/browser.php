<?php
$glob = glob($root . '/*');
$files = array_filter($glob, 'is_file');
$folders = array_filter($glob, 'is_dir');
$counter = 0;
?>

<ul>
  <?php foreach($folders as $path) : ?>
  <?php
  $part = str_replace(option('project.path') . '/', '', $path);
  if(option('revisions.hide', true) && basename($path) == option('revisions.folder', 'revisions')) continue;
  $counter++;
  ?>
    <li data-type="folder" data-id="<?= $part; ?>" title="<?= basename($path); ?>">
      <figure>
        <img src="<?= option('root.url'); ?>/assets/images/folder-solid.svg">
      </figure>
      <div class="filename"><?= basename($path); ?></div>
    </li>
  <?php endforeach; ?>

  <?php foreach($files as $path) : ?>
  <?php
  $extension = pathinfo($path)['extension'];
  $part = str_replace(option('project.path') . '/', '', $path);
  if(!in_array($extension, filetypes::markdown()) && !in_array($extension, filetypes::image())) continue;
  $counter++;
  ?>
    <li data-type="file" data-id="<?= $part; ?>" title="<?= basename($path); ?>">
      <figure>
        <?php if(in_array($extension, filetypes::image())) : ?>
          <img src="<?= option('root.url'); ?>/api/image/<?= $part; ?>">
        <?php else : ?>
          <img src="<?= option('root.url'); ?>/assets/images/file-regular.svg">
        <?php endif; ?>
      </figure>
      <div class="filename"><?= basename($path); ?></div>
      <div class="filesize"><?= humanFilesize(filesize($path)); ?></div>
    </li>
  <?php endforeach; ?>
</ul>

<?php if(!$counter) : ?>
  <h1>No files and folders found!</h1>
<?php endif; ?>