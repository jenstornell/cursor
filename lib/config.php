<?php
class config {
  public static function get($value) {
    global $config;
    return $config[$value];
  }

  public static function extensions() {
    $extensions = [];
    if(isset(self::get('extensions')['markdown']))
      $extensions = array_merge($extensions, self::get('extensions')['markdown']);

    if(isset(self::get('extensions')['image']))
      $extensions = array_merge($extensions, self::get('extensions')['image']);

    return $extensions;
  }

  public static function image() {
    if(isset(self::get('extensions')['image']))
      return self::get('extensions')['image'];
  }

  public static function markdown() {
    if(isset(self::get('extensions')['markdown']))
      return self::get('extensions')['markdown'];
  }

  public static function revisionsFolder() {
    if(isset(self::get('revisions')['folder']))
      return self::get('revisions')['folder'];
  }

  public static function revisionsLimit() {
    if(isset(self::get('revisions')['limit']))
      return self::get('revisions')['limit'];
  }
}