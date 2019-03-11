<?php
class WallCore {
  public function url($uri) {
    $root = $this->magicUrl();
    return ($uri) ? $root . $uri : $root;
  }

  public function magicUrl() {
    $uri = strtok($_SERVER["REQUEST_URI"],'?');
    $url = "//{$_SERVER['HTTP_HOST']}{$uri}";
    return htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
  }
}

class wall {
  public static function url($uri = null) {
    $wallcore = new WallCore();
    return $wallcore->url($uri);
  }
}