<?php
// MAIN CLASS
class TinyRouter {
  public $uri;
  public $presets = [
    ':all' => '.*',
    ':alphanum' => '[a-zA-Z0-9]+',
    ':alpha' => '[a-zA-Z]+',
    ':any' => '[^/]+',
    ':num' => '\d+|-\d+',
  ];

  function __construct() {
    $this->uri = $this->uri();
  }

  function init($pattern, $input = []) {
    $pattern = $this->replacements($pattern);
    $matches = $this->matchExpression($pattern);

    if(!$matches) return;

    if(function_exists('routeHook'))
      return routeHook($input, $matches);

    return $this->call($input, $matches);
  }

  function call($input, $matches) {
    switch(gettype($input)) {
      case 'object':
        return $input($matches);
        break;
      case 'string':
        return call_user_func_array($input, [$matches]);
        break;
      case 'array':
        return call_user_func_array([$input[0], $input[1]], [$matches]);
        break;
    }
  }

  function matchExpression($pattern) {
    $is_match = preg_match($pattern, $this->uri, $matches);
    if($is_match) return $matches;
  }

  function replacements($pattern) {
    $pattern = $this->fixHome($pattern);
    
    foreach($this->presets as $preset => $regex) {
      $pattern = str_replace($preset, '(' . $regex . ')', $pattern);
    }

    return '~^' . $pattern . '~';
  }

  function fixHome($pattern) {
    return $pattern == '/' ? '^/$' : $pattern;
  }

  function uri() {
    if(!isset($_SERVER['REDIRECT_URL'])) return '/';

    $uri = $_SERVER['REDIRECT_URL'];
    if(dirname($_SERVER['SCRIPT_NAME']) != '/') {
      $uri = str_replace(dirname($_SERVER['SCRIPT_NAME']), '', $_SERVER['REDIRECT_URL']);
    }

    $uri = trim($uri, '/');

    return $uri;
  }
}

// HELPERS

// route()
if(!function_exists('route')) {
  function route($pattern, $input) {
    $Route = new TinyRouter();
    $output = $Route->init($pattern, $input);
    if(isset($output)) {
      die($output);
    }
  }
}

// routes()
if(!function_exists('routes')) {
  function routes($routes) {
    foreach($routes as $pattern => $call) {
      route($pattern, $call);
    }
  }
}

// route::post()
if(!class_exists('route')) {
  class route {
    public static function match($pattern, $input, $method) {
      if($_SERVER['REQUEST_METHOD'] == $method) return route($pattern, $input);
    }

    // Matches methods like post,get, put etc
    public static function __callStatic($method, $args) {
      return self::match($args[0], $args[1], strtoupper($method));
    }
  }
}