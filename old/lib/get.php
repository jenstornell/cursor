<?php
class get {
  public static function value($name) {
    return (isset($_GET[$name]) && !empty($_GET[$name])) ? $_GET[$name] : false;
  }

  // Folder  
  public static function folderPath($data) {
    if(!isset($data->folderpath)) return false;
    return urldecode($data->folderpath);
  }

  public static function folderName($data) {
    $parts = explode('/', self::folderPath($data));
    return end($parts);
  }

  public static function folderParent($data) {
    $parts = explode('/', self::folderPath($data));
    array_pop($parts);
    $output = implode('/', $parts);
    $output = empty($output) ? '/' : $output;
    return $output;
  }

  // File
  public static function file() {
    if(!self::value('file')) return false;
    return self::value('file');
  }

  public static function fileName() {
    return pathinfo(self::file(), PATHINFO_FILENAME);
  }

  public static function fileExtension() {
    return pathinfo(self::file(), PATHINFO_EXTENSION);
  }

  public static function fileActiveClass($file) {
    return $file == self::file() ? ' data-active="true"' : '';
  }

  public static function fileModified() {
    return date("Y-m-d, H:i:s", filemtime(path::filePath()));
  }


  // Misc
  public static function type() {
    if(self::file()) return 'file';
    if(self::folderPath()) return 'folder';
  }

  public static function breadcrumb() {
    return '/' . trim(self::folderPath() . '/' . self::file(), '/');
  }
}