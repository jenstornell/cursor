<?php
namespace Knock;
use KnockException;

class Login {
  public function __construct($Core) {
    $this->Auth = new Authorization();
    $this->Cookie = new Cookie();
    $this->File = new File();
  }

  // Check if user is logged in with cookie
  public function isLoggedIn() {
    if(!$this->Cookie->hasCookies()) return;
    if(!$this->Cookie->cookiePath()) return;    

    $hash = include($this->Cookie->cookiePath());
    $hash_cookie = $this->Cookie->getCookie('cookie_hash');

    if($hash === $this->cookieHash($hash_cookie)) return true;
  }

  // Cookie hash
  private function cookieHash($hash) {
    return hash(knocko('algorithm'), $hash . knocko('salt'));
  }

  // Login authorized
  public function loginAuthorized() {
    usleep(knocko('login_delay') * 1000);

    if(!$this->Auth->currentIpAllowed()) {
      throw new KnockException('currentIpAllowed{}' . $_SERVER['REMOTE_ADDR']);
    }
    if(!$this->Auth->currentIsAuthorized()) {
      throw new KnockException('currentIsAuthorized{}' . $this->Auth->post('post_username'));
    }
    
    $this->loginUser($this->Auth->post('post_username'));
  }

  // Login user
  public function loginUser($username) {
    $hash = bin2hex(random_bytes(16));

    $this->Cookie->write($hash, $username, knocko('setcookie_expires'));
    $this->File->write($hash, $username);
  }

  // Logout user
  public function logoutUser($username) {
    $this->Cookie->deleteAll();
    if(!$username) return;
    $this->File->delete($this->File->tempPath($username));
  }
}