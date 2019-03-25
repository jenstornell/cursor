<?php
class KnockOptions {
  public $scope = 'knock';

  public function setDefaults($defaults) {
    global $tiny_options;
    $tiny_options[$this->scope]['defaults'] = $defaults;
  }

  private function getItem($name, $type) {
    global $tiny_options;
    if(isset($tiny_options[$this->scope][$type][$name]))
      return $tiny_options[$this->scope][$type][$name];
  }

  private function defaults() {
    return $this->collection('defaults');
  }

  private function options() {
    return $this->collection('options');
  }

  private function collection($type) {
    global $tiny_options;

    $collection = [];

    if(isset($tiny_options[$this->scope][$type])) {
      $collection = $tiny_options[$this->scope][$type];
    }

    return (!empty($collection)) ? $collection : [];
  }

  public function set($name, $value) {
    global $tiny_options;
    $tiny_options[$this->scope]['options'][$name] = $value;
  }

  public function get($name, $fallback = null) {
    return ($name) ? $this->single($name, $fallback) : $this->all();
  }

  private function all() {
    return array_merge($this->defaults(), $this->options());
  }

  private function single($name, $fallback) {
    global $tiny_options;

    $option = $this->getItem($name, 'options');

    if($option) {
      $value = $option;
    } elseif(isset($fallback)) {
      $value = $fallback;
    } else {
      $value = $this->getItem($name, 'defaults');
    }
    return $value;
  }

  public function unsetString($name) {
    global $tiny_options;

    if(isset($tiny_options[$this->scope]['options'][$name])) {
      unset($tiny_options[$this->scope]['options'][$name]);
    }
  }

  public function unsetArray($names) {
    foreach($names as $name) {
      $this->unsetString($name);
    }
  }

  public function unsetAll() {
    global $tiny_options;
    unset($tiny_options[$this->scope]['options']);
  }
}

// HELPERS

class knocko {
  // option::set()
  public static function set($input, $value = null) {
    $TinyOptions = new KnockOptions();

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
  public static function unset($data = null) {
    $TinyOptions = new KnockOptions();

    if(is_string($data)) {
      $TinyOptions->unsetString($data);
    } elseif(is_array($data)) {
      $TinyOptions->unsetArray($data);
    } else {
      $TinyOptions->unsetAll();
    }
  }

  // options::default
  public static function default($defaults) {
    $TinyOptions = new KnockOptions();
    $TinyOptions->setDefaults($defaults);
  }
}

// option::get()
function knocko($name = null, $fallback = null) {
  $TinyOptions = new KnockOptions();
  return $TinyOptions->get($name, $fallback);
}