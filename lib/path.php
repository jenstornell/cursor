<?php
class path {
  public static function folderPath($data) {
    return rtrim(config::get('root') . '/' . $data->folderpath, '/');
  }

  public static function folderParentPath() {
    return config::get('root') . '/' . get::folderParent();
  }

  public static function filePath() {
    return config::get('root') . '/' . get::folderPath() . '/' . get::file();
  }

  public static function revisions() {
    return (config::revisionsFolder()) ? path::folderPath() . '/' . config::revisionsFolder() : path::folderPath() . '/revisions';
  }

  public static function revisionFolder() {
    return self::revisions() . '/' . get::fileName() . '_' . get::fileExtension();
  }
}