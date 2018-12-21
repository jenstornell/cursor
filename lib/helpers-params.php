<?php
class params {
  public static function pathToArray() {

  }

  public static function pathToFolderName($path) {
    $parts = explode('/', $path);
    return end($parts);
  }
}