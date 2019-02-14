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
  defaults();

  $options = flattenOptions(include __DIR__ . '/../options.php');
  option::set($options);

  option::set('filetypes', array_merge(option('filetypes.image'), option('filetypes.markdown')));
}

function defaults() {
  option::default([
    'autosave' => true,
    'autosave.interval' => 15,
    'bar.bottom' => true,
    'bar.top' => true,
    'editor.width' => 900,
    'filetypes.image' => ['png', 'gif', 'svg', 'webp', 'jpg', 'jpeg'],
    'filetypes.markdown' => ['markdown', 'mdown', 'mkdn', 'md', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'text', 'rmd', 'txt', ''],
    'project.css' => null,
    'project.path' => null,
    'preview.width' => 900,
    'root.url' => null,
    'revisions.folder' => 'revisions',
    'revisions.hide' => true,
    'revisions.max' => 2,
    'sidebar.width' => 300,
    'spellcheck' => false,
    '.root.path' => __DIR__ . '/../',
  ]);
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