<?php global $error; ?>
<div id="sidebar">
  <div class="logo">
    Markdown Surface
  </div>

  <ajax-explorer></ajax-explorer>
  <?php /*
  <aside-bar>
    <ul>
      <li class="new-file" data-toggle-class="active" data-toggle-target="widget-create-file" data-toggle-group="tabsGroup">
        <figure>
          <img src="<?= config::get('url'); ?>/assets/icons/feather-file-text.svg">
        </figure>
      </li>
      <li class="new-folder" data-toggle-class="active" data-toggle-target="widget-create-folder" data-toggle-group="tabsGroup">
        <figure>
          <img src="<?= config::get('url'); ?>/assets/icons/feather-folder-plus.svg">
        </figure>
      </li>
      <li class="image">
        <form action="<?= url::fileUrl(); ?>" method="post" enctype="multipart/form-data">
          <label for="image">
            <figure>
              <img src="<?= config::get('url'); ?>/assets/icons/feather-image.svg">
            </figure>
          </label>
          <input id="image" type="file" name="image">
        </form>
      </li>
    </ul>
  </aside-bar>

<?php if((post::is('submit-create-file')) && $error) : ?>
        <div class="error"><?= $error; ?></div>
      <?php endif; ?>

  
    <widget-create-file method="post" action="<?= url::fileUrl(); ?>">
      <input type="text" name="name" placeholder="Filename">
      <input type="button" value="Add">
    </widget-create-file>

    <widget-create-folder method="post" action="<?= url::fileUrl(); ?>">
      <input type="text" name="name" placeholder="Folder name">
      <input type="button" value="Add">
    </widget-create-folder>
    */
    ?>

  <div class="logout">
    <a href="<?= config::get('url'); ?>/logout.php" onclick="return confirm('Are you sure you want to logout?')">Logout</a>
  </div>
</div>