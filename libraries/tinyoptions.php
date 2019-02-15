<?php
class TinyOptions {
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

  public function all() {
    global $tiny_options;
    return array_merge($tiny_options[$this->scope]['defaults'], $tiny_options[$this->scope]['options']);
    
    return $array;
    return $tiny_options[$this->scope]['options'];
  }
}

// HELPERS

class option {
  // option::set()
  public static function set($input, $value = null) {
    $TinyOptions = new TinyOptions();

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
    $TinyOptions = new TinyOptions();

    if(is_string($data)) {
      $TinyOptions->unsetString($data);
    } elseif(is_array($data)) {
      $TinyOptions->unsetArray($data);
    }
  }

  // options::default
  public static function default($defaults) {
    $TinyOptions = new TinyOptions();
    $TinyOptions->setDefaults($defaults);
  }
}

// option::get()
function option($name = null, $fallback = null) {
  $TinyOptions = new TinyOptions();
  if($name) {
    return $TinyOptions->get($name, $fallback);
  } else {
    return $TinyOptions->all();
  }
}