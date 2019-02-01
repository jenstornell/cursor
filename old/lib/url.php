<?php
class url {
  public static function rootIndex() {
    return config::get('url') . '/index.php';
  }

  public static function rootGet() {
    return self::rootIndex() . '?path=';
  }

  public static function folderUrl($data) {
    return urlencode(get::folderPath($data));
  }

  public static function folderParentUrl() {
    return self::rootGet() . urlencode(get::folderParent());
  }

  public static function folderAppend($data) {
    $folder_path = (get::folderPath($data)) ? urlencode(get::folderPath($data) . '/') : '';
    return self::rootGet() . $folder_path;
  }

  public static function fileUrl() {
    return self::folderUrl() . '&file=' . get::file();
  }

  public static function fileAppend($file) {
    return self::folderUrl() . '&file=' . $file;
  }

  public static function back($data) {
    $parts = explode('/', get::folderPath($data));
    array_pop($parts);
    if(count($parts) > 0)
      return urlencode(implode('/', $parts));
    else
      return  '';
  }
}