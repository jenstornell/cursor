<?php
function flattenOptions($array, $old = '') {
  if (!is_array($array)) {
    return FALSE;
  }
  $result = array();
  foreach ($array as $key => $value) {
    if (is_array($value)) {
      $result = array_merge($result, flattenOptions($value, $key));
    }
    else {
      $prefix = ($old !== '') ? $old . '.' : '';
      $result[$prefix . $key] = $value;
    }
  }
  return $result;
}

function contains($needle, $haystack) {
  return strpos($haystack, $needle) !== false;
}

function spellcheck() {
  if(option('spellcheck') !== '') {
    $spellcheck_option = option('spellcheck') ? 'true' : 'false';
    $spellcheck = ' spellcheck="' . $spellcheck_option . '"';
  } else {
    $spellcheck = '';
  }
  return $spellcheck;
}

function setOptions() {
  include __DIR__ . '/../libraries/tinyoptions.php';

  $options = flattenOptions(include __DIR__ . '/../options.php');
  option::set($options);
}

function humanFilesize($bytes, $decimals = 2) {
  if ($bytes < 1024) {
      return $bytes . ' byte';
  }

  $factor = floor(log($bytes, 1024));
  return sprintf("%.{$decimals}f ", $bytes / pow(1024, $factor)) . ['byte', 'kB', 'MB', 'GB', 'TB', 'PB'][$factor];
}

function post() {
  $content = file_get_contents('php://input');
  if(empty($content)) return;
  return json_decode($content, true);
}

class filetypes {
  public static function markdown() {
    return option('filetypes.markdown', ['markdown', 'mdown', 'mkdn', 'md', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'text', 'rmd', 'txt', '']);
  }

  public static function image() {
    return option('filetypes.image', ['png', 'gif', 'svg', 'webp', 'jpg', 'jpeg']);
  }
}

function is_dir_empty($dir) {
  if (!is_readable($dir)) return NULL;
  $handle = opendir($dir);
  while (false !== ($entry = readdir($handle))) {
    if ($entry != "." && $entry != "..") {
      return FALSE;
    }
  }
  return TRUE;
}