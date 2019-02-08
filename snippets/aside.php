<aside class="scrollbar">
  <div class="filebar">
    <ul>
      <li class="upload-file">
        <img src="<?= option('root.url'); ?>/assets/images/upload.svg">
      </li>
      <li class="add-file">
        <img src="<?= option('root.url'); ?>/assets/images/file-regular.svg">
      </li>
      <li class="add-folder">
        <img src="<?= option('root.url'); ?>/assets/images/folder-solid.svg">
      </li>
      <li class="delete">
        <img src="<?= option('root.url'); ?>/assets/images/trash.svg">
      </li>
      <?php /*
      <li class="add-refresh">
        <img src="<?= option('root.url'); ?>/assets/images/refresh-cw.svg">
      </li>
      */
      ?>
    </ul>
  </div>
  <stair-case data-staircase-path="<?= option('root.url'); ?>/core/filetree.php"></stair-case>
</aside>