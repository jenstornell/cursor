<?php
use Knock\Login;
use Knock\Core;
use Knock\Cookie;
use Knock\User;
use Knock\Authorization;

class Knock {
  public function __construct($options = null) {
    $this->Core = new Core($options);
    
    $this->Auth = new Authorization();
    $this->Cookie = new Cookie($this->Core);
    $this->Login = new Login($this->Core);
    $this->User = new User($this->Core);
  }

  // ARRAY

  // Login
  public function login() {
    try {
      $this->Login->loginAuthorized();
      return $this->success();
    } catch(KnockException $e) {
      return $this->error($e);
    }
  }

  // Logout
  public function logout() {
    try {
      $this->Login->logoutUser($this->Cookie->getCookie('cookie_username'));
      return $this->success();
    } catch(KnockException $e) {
      return $this->error($e);
    }
  }

  // Create user
  public function createUser($username, $password) {
    try {
      $this->User->createUser($username, $password);
      return $this->success();
    } catch(KnockException $e) {
      return $this->error($e);
    }
  }

  // Refresh the cookies, creates new hash and expire timestamp
  public function refresh() {
    if(!$this->Login->isLoggedIn()) return;

    try {
      $this->Login->loginUser($this->Cookie->getCookie('cookie_username'));
      return $this->success();
    } catch(KnockException $e) {
      return $this->error($e);
    }
  }

  // STRING/INT

  // Get the cookies expire timestamp
  public function getCookieExpires() {
    return $this->Cookie->getCookie('cookie_expires');
  }

  // Get all options
  public function getOptions() {
    return knocko();
  }

  // Get username
  public function getUsername() {
    return $this->Cookie->getCookie('cookie_username');
  }

  // Get userpath
  public function getUserpath() {
    return realpath(knocko('path_users') . '/' . $this->Cookie->getCookie('cookie_username') . '.php');
  }

  // BOOLEAN

  // is authorized
  public function isAuthorized() {
    return $this->Auth->currentIsAuthorized();
  }

  // Is logged in
  public function isLoggedIn() {
    return $this->Login->isLoggedIn();
  }

  // Keep alive
  public function keepAlive() {
    return $this->Cookie->keepAlive($this->Login);
  }

  // PRIVATE

  // Success
  private function success() {
    return ['success' => true];
  }

  // Error
  private function error($e) {
    return ['success' => false, 'error' => $e->getMessage()];
  }
}