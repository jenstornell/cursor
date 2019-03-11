<?php
class WallTinyOptions {
  public $scope = 'default';

  public function setDefaults($defaults) {
    global $tiny_options;
    $tiny_options[$this->scope]['defaults'] = $defaults;
  }

  private function getDefault($name) {
    global $tiny_options;
    if(isset($tiny_options[$this->scope]['defaults'][$name]))
      return $tiny_options[$this->scope]['defaults'][$name];
  }

  public function set($name, $value) {
    global $tiny_options;
    $tiny_options[$this->scope]['options'][$name] = $value;
  }

  public function get($name, $fallback = null) {
    global $tiny_options;
    
    if(isset($tiny_options[$this->scope]['options'][$name])) return $tiny_options[$this->scope]['options'][$name];
    if(isset($fallback)) return $fallback;
    return $this->getDefault($name);
  }

  public function unsetString($name) {
    global $tiny_options;

    if(isset($tiny_options[$this->scope]['options'][$name])) unset($tiny_options[$this->scope]['options'][$name]);
  }

  public function unsetArray($names) {
    foreach($names as $name) {
      $this->unsetString($name);
    }
  }
}

// HELPERS

class walloption {
  // option::set()
  public static function set($input, $value = null) {
    $TinyOptions = new WallTinyOptions();

    if(is_string($input)) {
      $name = $input;
      $TinyOptions->set($name, $value);
    } elseif(is_array($input)) {
      foreach($input as $name => $value) {
        $TinyOptions->set($name, $value);
      }
    }
  }

  // option::unset()
  public static function unset($data) {
    $TinyOptions = new WallTinyOptions();

    if(is_string($data)) {
      $TinyOptions->unsetString($data);
    } elseif(is_array($data)) {
      $TinyOptions->unsetArray($data);
    }
  }

  // options::default
  public static function default($defaults) {
    $TinyOptions = new WallTinyOptions();
    $TinyOptions->setDefaults($defaults);
  }
}

// option::get()
function walloption($name, $fallback = null) {
  $TinyOptions = new WallTinyOptions();
  return $TinyOptions->get($name, $fallback);
}