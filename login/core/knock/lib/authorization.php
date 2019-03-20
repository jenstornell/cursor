<?php
namespace Knock;

class Authorization {
  // Current is authorized
  function currentIsAuthorized() {
    $username = $this->post('post_username');
    $password = $this->post('post_password');

    if(!$username || !$password) return;

    return $this->isAuthorized($username, $password);
  }

  // Check if IP is allowed
  public function ipAllowed($ip, $whitelist) {
    if(!empty($whitelist)) {
      foreach($whitelist as $item) {
        if($this->matches($ip, $item)) return true;
      }
      return;
    }
    return true;
  }

  // Item ends with *
  private function matches($ip, $item) {
    if(substr($item, -1) === '*') {
      $match = substr($item, 0, -1);
      return $this->startsWith($match, $ip);
    }
    return ($item === $ip);
  }

  // Starts with
  private function startsWith($needle, $haystack) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
  }

  // Validate with current IP
  public function currentIpAllowed() {
    return $this->ipAllowed($_SERVER['REMOTE_ADDR'], knocko('whitelist'));
  }

  // Check if user is authorized with post variables
  public function isAuthorized($username = null, $password = null) {
    $data = $this->getUserData($username);

    if(!isset($data['password'])) return;

    if($data['password'] === $this->hashPassword($password)) {
      return true;
    }
  }

  // get userdata
  function getUserData($username) {
    if(!file_exists($this->filepath($username))) return;
    return include($this->filepath($username));
  }

  // Hash password
  function hashPassword($password) {
    return hash(knocko('algorithm'), $password);
  }

  function filepath($username) {
    return knocko('path_users') . $username . '.php';
  }

  // Has post
  public function post($key) {
    return (isset($_POST[knocko('key_' . $key)])) ? $_POST[knocko('key_' . $key)] : null;
  }
}