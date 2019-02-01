<?php
class cookie {
  // Check if the cookies are set
  public static function is() {
    if(!isset($_COOKIE[self::pre() . 'user'])) return false;
    if(!isset($_COOKIE[self::pre() . $_COOKIE[self::pre() . 'user']])) return false;

    return true;
  }

  // Get cookie value which is a random string
  public static function value() {
    return $_COOKIE[self::pre() . $_COOKIE[self::pre() . 'user']];
  }

  // Get cookie key which is an md5 of $_POST username
  public static function key() {
    return $_COOKIE[self::pre() . 'user'];
  }

  // Delete all cookies
  public static function delete() {
    if(isset($_SERVER['HTTP_COOKIE'])) {
      $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
      foreach($cookies as $cookie) {
          $parts = explode('=', $cookie);
          $name = trim($parts[0]);
          setcookie($name, '', time()-1000);
          setcookie($name, '', time()-1000, '/');
      }
    }
  }

  // Prefix but replace _ with .
  public static function pre() {
    return str_replace('.', '_', self::prefix());
  }

  // Prefix cookie key
  public static function prefix() {
    return 'mark48.';
  }

  // Set cookies
  public static function set($unique) {
    $time = strtotime('+1 hours');

    if(!setcookie(self::prefix() . login::filename(), $unique, $time, '/')) {
      return false;
    }

    if(!setcookie(self::prefix() . 'user', login::filename(), $time, '/')) {
      return false;
    }

    return true;
  }
}