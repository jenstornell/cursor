<?= snippet('header'); ?>
<main>
  <?php snippet('sidebar'); ?>
  <div class="surface">
    <?php if(in_array(get::fileExtension(), config::image())) : ?>
      <?= snippet('image'); ?>
    <?php elseif(get::file()) : ?>
      <form id="input" class="text" method="post" action="<?= url::fileUrl(); ?>">
        <?= snippet('bar-top'); ?>
        <div class="text">
          <?= snippet('input'); ?>
          <?= snippet('output'); ?>
        </div>
        <?= snippet('bar'); ?>
      </form>
    <?php endif; ?>
  </div>
</main>
<?= snippet('footer'); ?>