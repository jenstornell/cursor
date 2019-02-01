<bar-top>
  <div class="folder">
    <img src="<?= config::get('url'); ?>/assets/icons/feather-folder.svg">
    <?= get::folderName(); ?>
  </div>
  <div class="folder">
    <img src="<?= config::get('url'); ?>/assets/icons/feather-file-text.svg">
    <?= get::file(); ?>
  </div>
</bar-top>