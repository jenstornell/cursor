<?php
$List = new Explorer($args); ?>

<?php if($List->folders()) : ?>
  <ul class="folders">
    <?php foreach($List->folders() as $folder) : ?>
      <li data-path="<?= trim(str_replace(config::get('root'), '', $folder), '/'); ?>">
        <figure>
          <img src="<?= config::get('url'); ?>/assets/icons/ion-folder.svg">
        </figure>
        <div class="text">
          <?= basename($folder); ?> <span>(<?= find::count($folder); ?>)</span>
        </div>
      </li>
    <?php endforeach; ?>
  </ul>
<?php endif;