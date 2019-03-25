<?php
namespace Knock;
use Knocko;

class Core {
  // Set options
  public function __construct($options = null) {
    $this->options($options);
  }

  // Defaults
  private function defaults() {
    return [
      'algorithm' => 'sha256',
      'cookie_prefix' => 'knock',
      'cookie_refresh' => 15, // Bad key name
      'login_delay' => 500,
      'login_attempts' => 5,
      'key_cookie_expires' => 'expires',
      'key_cookie_hash' => 'hash',
      'key_cookie_username' => 'username',
      'key_post_password' => 'password',
      'key_post_username' => 'username',
      'path_temp' => __DIR__ . '/../temp/',
      'path_users' => __DIR__ . '/../users/',
      'salt' => '',
      'setcookie_domain' => '',
      'setcookie_expires' => 0,
      'setcookie_httponly' => false,
      'setcookie_path' => '',
      'setcookie_secure' => false,
      'whitelist' => [],
    ];
  }

  // Starts with
  private function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
  }

  // Set options
  public function options($options) {
    knocko::default($this->defaults());

    if($options) {
      knocko::set($options);
    }
  }
}