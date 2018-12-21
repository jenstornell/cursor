<?php
class login {
  public static function loginUser() {
    if(!self::isValidLogin()) return false;
    if(!self::createCookiesFolder()) return false;

    $unique = self::unique();

    if(!self::setServerValue($unique)) return false;
    if(!cookie::set($unique)) return false;

    header("Location: " . config::get('url'));
    die;
  }

  // Unique random value
  public static function unique() {
    $bytes = random_bytes(12);
    return bin2hex($bytes);
  }

  // Set server value into the cookies folder
  public static function setServerValue($unique) {
    return file_put_contents(self::filepath(self::filename()), $unique);
  }

  // Check if $_POST username and password are valid
  public static function isValidLogin() {
    $username = post::value('username');
    $password = md5(post::value('password'));

    if(!isset(config::get('users')[$username])) return false;
    if(config::get('users')[$username] != $password) return false;

    return true;
  }

  // Filename
  public static function filename() {
    return md5($_POST['username']);
  }

  // Cookies filepath
  public static function filepath($filename) {
    return __DIR__ . '/../cookies/' . $filename;
  }

  // Get cookie key which is a random string
  public static function getServerValue() {
    return file_get_contents(self::filepath(cookie::key()));
  }

  // Check if cookie is valid and the same value as on server
  public static function isValidMatch() {
    if(!cookie::is()) return false;
    if(self::getServerValue() != cookie::value()) return false;

    return true;
  }

  // Create cookies folder to store cookies
  public static function createCookiesFolder() {
    $path = __DIR__ . '/../cookies';

    if(!file_exists($path))
      return mkdir(__DIR__ . $path, 0755);
    else
      return true;
  }
}