<?php $List = new Explorer($args); ?>

<?php if($List->folderParent()) : ?>
  <ul class="parent">
    <li>
      <a href="#" data-folder="<?= $List->folderParent(); ?>">
        <figure>
          <img src="<?= config::get('url'); ?>/assets/icons/ion-return-left.svg">
        </figure>
        <div class="text">
          <?= $List->folderParentName(); ?>
        </div>
      </a>
    </li>
  </ul>
<?php endif; ?>