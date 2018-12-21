<?php
function walkToDir($tree, $path) {
  $parts = explode('/', $path);
  if(count($parts) > 1) {
    $current_path = array_shift($parts);
    $tree = $tree[$current_path];
    $path = rtrim(implode('/', $parts), '/');
    return walkToDir($tree, $path);
  } else {
    if($path) {
      return $tree[$path];
    } else {
      return $tree;
    }
  }
}

function contains($needle, $haystack) {
  return strpos($haystack, $needle) !== false;
}

function slug($string) {
  return strtolower(
    trim(
      preg_replace(
          '~[^0-9a-z]+~i',
          '-',
          html_entity_decode(
          preg_replace(
              '~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i',
              '$1',
              htmlentities(
              $string,
              ENT_QUOTES,
              'UTF-8'
              )
          ),
          ENT_QUOTES,
          'UTF-8'
          )
      ),
      '-'
      )
  );
}