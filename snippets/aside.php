<aside>
  <div class="filebar">
    <ul>
      <li class="upload-file">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/upload-2-line.svg" title="Upload file">
      </li>
      <li class="add-file">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/file-add-line.svg" title="Add file">
      </li>
      <li class="add-folder">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/folder-add-fill.svg" title="Add folder">
      </li>
      <li class="delete">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/delete-bin-line.svg" title="Delete">
      </li>
    </ul>
    <ul>
      <li class="logout">
        <img src="<?= option('root.url'); ?>/assets/images/remixicon/logout-box-line.svg" title="Logout">
      </li>
    </ul>
  </div>
  <stair-case class="scrollbar" data-staircase-path="<?= option('root.url'); ?>/core/filetree.php"></stair-case>
</aside>

<input type="file" id="upload">