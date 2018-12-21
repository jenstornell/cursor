<?php $List = new Explorer($args); ?>

<?php if($List->files()) : ?>
  <ul class="files">
    <?php foreach($List->files() as $file) : ?>
      <li data-path="<?= trim(str_replace(config::get('root'), '', dirname($file)), '/') . basename($file); ?>">
        <figure>
          <img src="<?= config::get('url'); ?>/assets/icons/ion-document.svg">
        </figure>
        <div class="text">
          <?= basename($file); ?>
        </div>
      </li>
    <?php endforeach; ?>
  </ul>
<?php endif;