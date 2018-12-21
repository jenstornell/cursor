<?php
class post {
  public static function is($test) {
    return isset($_POST[$test]);
  }

  public static function value($name) {
    return (isset($_POST[$name]) && !empty($_POST[$name])) ? $_POST[$name] : false;
  }
}