<?php
namespace Knock;
use KnockException;

class User {
  // Create user
  public function createUser($username = null, $password = null) {
    if(!$username || !$password) {
      throw new KnockException('createUser{}NoCredentials');
    } elseif(file_exists(knocko('path_users') . $username . '.php')) {
      throw new KnockException('createUser{}' . knocko('path_users') . $username . '.php');
    } else {
      $content = sprintf("<?php return ['password' => '%s'];", hash('sha256', $password));
      $success = file_put_contents(knocko('path_users') . $username . '.php', $content);
      if(!$success) {
        throw new KnockException('createUser{}' . knocko('path_users') . $username . '.php');
      }
    }
  }
}