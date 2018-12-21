<?php
class find {
  public static function filePattern($data) {
    echo path::folderPath($data);
    return path::folderPath($data) . "/*.{md,txt,jpg,gif,png}";
  }

  public static function folderPattern($data) {
    return path::folderPath($data) . "/*";
  }

  public static function folders($data) {
    return glob(self::folderPattern($data), GLOB_ONLYDIR);
  }

  public static function files($data) {
    return glob(self::filePattern($data), GLOB_BRACE);
  }

  public static function fileCount($folder) {
    return count(glob($folder . "/*.{md,txt,jpg,gif,png}", GLOB_BRACE));
  }

  public static function folderCount($folder) {
    return count(glob($folder . "/*", GLOB_ONLYDIR));
  }

  public static function count($folder) {
    return self::fileCount($folder) + self::folderCount($folder);
  }
}