<?php $hide = option('bar.bottom') ? '' : 'data-hide'; ?>

<div class="bottombar state" <?= $hide; ?>>
  <ul>
    <li class="count state">
    </li>
  </ul>
  <ul>
    <li class="dimensions state"></li>
    <li class="filesize state"></li>
    <li class="timestamp state"></li>
  </ul>
</div>