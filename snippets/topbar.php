<?php $hide = option('bar.top') ? '' : 'data-hide'; ?>

<div class="topbar state" <?= $hide; ?>>
  <ul>
    <li class="path" data-path>
      <span></span>
      <input type="text" spellcheck="false">
    </li>
  </ul>
  <ul>
  <?php /*
    <li class="fullscreen">
      <img src="<?= option('root.url'); ?>/assets/images/remixicon/fullscreen-line.svg">
      <label>
        Fullscreen
      </label>
    </li>
    */
    ?>
  </ul>
</div>