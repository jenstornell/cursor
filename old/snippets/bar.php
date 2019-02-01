<div class="bar">
  <div class="left">
    <div class="breadcrumb">
      <?= get::breadcrumb(); ?>
    </div>
  </div>
  <div class="right">
    <div class="modified">
      <strong>Saved</strong>
      <?= get::fileModified(); ?>
    </div>
    <div class="save">
      <input name="submit-file-save" type="submit" value="Spara">
    </div>
  </div>
</div>