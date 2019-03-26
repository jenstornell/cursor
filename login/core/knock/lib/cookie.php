<?php
namespace Knock;

class Cookie {
  // Get cookie
  public function getCookie($key) {
    return (isset($_COOKIE[knocko('cookie_prefix')][knocko('key_' . $key)])) ? $_COOKIE[knocko('cookie_prefix')][knocko('key_' . $key)] : null;
  }

  // Write cookies
  public function write($hash, $username, $expires) {
    $this->setUsername($username);
    $this->setHash($hash);
    $this->setExpires($expires);
  }

  // Delete cookies
  public function deleteAll() {
    if(!isset($_COOKIE[knocko('cookie_prefix')])) return;

    foreach($_COOKIE[knocko('cookie_prefix')] as $key => $cookie) {
      $this->setCookie('[' . $key . ']', '', 0);
    }
  }

  public function cookiePath() {
    return knocko('path_temp') . $this->getCookie('cookie_username') . '.php';
  }

  // Set username
  private function setUsername($username) {
    $this->setCookie('[' . knocko('key_cookie_username') . ']', $username);
  }

  // Set hash
  private function setHash($hash) {
    $this->setCookie('[' . knocko('key_cookie_hash') . ']', $hash);
  }

  // Set expires
  private function setExpires($expires) {
    $this->setCookie('[' . knocko('key_cookie_expires') . ']', $expires);
  }

  // Set cookie
  private function setCookie($key, $value, $expires = null) {
    $success = setcookie(
      knocko('cookie_prefix') . $key,
      $value,
      $this->expires($expires),
      knocko('setcookie_path'),
      knocko('setcookie_domain'),
      knocko('setcookie_secure'),
      knocko('setcookie_httponly')
    );

    if(!$success) {
      throw new KnockException('setCookie{}' . $key);
    }
  }

  // Expires
  private function expires($expires) {
    return ($expires === null) ? knocko('setcookie_expires') : $expires;
  }

  // Refresh the cookies if the cookies will soon expire
  public function keepAlive($login) {
    return ($this->ExpireTimeLeft(knocko('cookie_refresh')) < 0) ? $this->refresh($login) : true;
  }

  // Refresh
  public function refresh($login) {
    if(!$login->isLoggedIn()) return;
    $login->loginUser($this->getCookie('cookie_username'));
  }

  // Expire timeleft
  private function ExpireTimeLeft($refresh) {
    $minutes = round(((int)$this->getCookie('cookie_expires')-time())/60);
    $diff = $minutes - $refresh;
    return $diff;
  }

  // Has cookies
  public function hasCookies() {
    if($this->getCookie('cookie_expires') === null) return;
    if(!$this->getCookie('cookie_hash')) return;
    if(!$this->getCookie('cookie_username')) return;

    return true;
  }
}