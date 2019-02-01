<?php
function snippet($filename, $args = [], $return = false) {
  ob_start();
  include __DIR__ . '/../snippets/' . $filename . '.php';
  $data = ob_get_contents();
  ob_end_clean();

  if(!$return)
    echo $data;
  else
    return $data;
}