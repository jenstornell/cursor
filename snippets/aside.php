<aside class="scrollbar">
  <div class="filebar">
    <ul>
      <li class="upload-file">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/upload-2-line.svg">
      </li>
      <li class="add-file">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/file-add-line.svg">
      </li>
      <li class="add-folder">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/folder-add-fill.svg">
      </li>
      <li class="delete">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/delete-bin-line.svg">
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

<input type="file" id="upload">