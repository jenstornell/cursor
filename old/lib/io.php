<?php
class io {
  public static function read() {
    $url = config::get('root') . '/' . urldecode(get::folderPath() . '/'.  get::file());
  }
}