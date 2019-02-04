<?php $hide = option('bar.top', true) ? '' : 'data-hide'; ?>

<div class="topbar state" <?= $hide; ?>>
  <ul>
    <li class="path" data-path>
      <span></span>
      <input type="text" spellcheck="false">
    </li>
  </ul>
  <ul>
    <li class="fullscreen">
      <img src="<?= option('root.url'); ?>/assets/images/maximize.svg">
      <label>
        Fullscreen
      </label>
    </li>
  </ul>
</div>