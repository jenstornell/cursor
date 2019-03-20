<?php
namespace Knock;

class File {
  // Content
  function content($hash) {
    return "<?php return '" . $this->fileHash($hash) . "';";
  }

  // Delete file
  public function delete($path) {
    echo $path;
    if(file_exists($path)) {
      if(!unlink($path)) {
        throw new KnockException('delete{}' . $path);
      }
    }
  }

  // Filehash
  private function fileHash($hash) {
    return hash(knocko('algorithm'), $hash . knocko('salt'));
  }

  // Make directiory
  private function makeDir($path) {
    if(!file_exists($path)) {
      if(!mkdir($path)) {
        throw new KnockException('makeDir{}' . $path);
        return;
      }
    }
    return true;
  }

  // Write temp file to disc
  public function write($hash, $username) {
    if(!$this->makeDir(knocko('path_temp'))) return;
    $this->writeContent($hash, $username);
  }

  // Temp path
  function tempPath($username) {
    return knocko('path_temp') . $username . '.php';
  }

  // Write content
  function writeContent($hash, $username) {
    if(!file_put_contents($this->tempPath($username), $this->content($hash))) {
      throw new KnockException('writeFile{}' . $username);
    }
  }
}
/*

  // Filepath
  private function filepath($type, $username = null) {
    switch($type) {
      case 'post':
        $filepath = $this->path_users . $_POST[$this->key_post_username] . '.php';
        break;
      case 'cookie':
        $filepath = $this->path_temp . $_COOKIE[$this->cookie_prefix][$this->key_cookie_username] . '.php';
        break;
      case 'user':
        $filepath = $this->path_temp . $username . '.php';
        break;
    }

    if(!file_exists($filepath)) {
      throw new KnockException('filepath{}' . $filepath);
      return;
    } else {
      return $filepath;
    }
  }
  */