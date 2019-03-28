<?php $hide = option('bar.bottom') ? '' : 'data-hide'; ?>

<div class="bottombar state" <?= $hide; ?>>
  <ul>
    <li class="count state">
    </li>
  </ul>
  <ul>
    <li class="revisions_count state" title="Revisions"></li>
    <li class="dimensions state" title="Dimensions"></li>
    <li class="filesize state" title="Filesize"></li>
    <li class="timestamp state" title="Saved"></li>
  </ul>
</div>