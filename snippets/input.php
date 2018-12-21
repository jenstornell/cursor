<div id="input-wrap">
  <textarea placeholder="Markdown" name="input" data-syncscroll="match"><?php
    if(path::filePath()) {
      echo file_get_contents(path::filePath());
    }

    echo file_get_contents(__DIR__ . '/../text.txt');
    ?>
  </textarea>
</div>