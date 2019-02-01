<?php $hide = option('bar.bottom', true) ? '' : 'data-hide'; ?>

<div class="bottombar" <?= $hide; ?>>
  <ul>
    <li class="count">
    </li>
  </ul>
  <ul>
    <li class="dimensions"></li>
    <li class="filesize"></li>
    <li class="timestamp"></li>
  </ul>
</div>