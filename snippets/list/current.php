<?php $List = new Explorer($args); ?>

<?php if($List->folder()) : ?>
  <ul class="current">
    <li>
      <a href="#" data-folder="<?= $List->folder(); ?>">
        <figure>
          <img src="<?= config::get('url'); ?>/assets/icons/ion-folder-current.svg">
        </figure>
        <div class="text">
          <?= $List->folderName(); ?> <span>(<?= find::count($List->folder()); ?>)</span>
        </div>
      </a>
    </li>
  </ul>
<?php endif; ?>