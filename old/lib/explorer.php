<?php
class Explorer {
  function __construct($data) {
    $this->data = $data;
  }

  function folder() {
    if(!isset($this->data['path']) || empty($this->data['path'])) return false;

    $folderpath = $this->data['path'];
    $parts = explode('/', $folderpath);

    return implode('/', $parts);
  }

  function folders() {
    $pattern = config::get('root') . '/' . $this->folder() . "/*";

    return glob($pattern, GLOB_ONLYDIR);
  }

  function folderName() {
    return params::pathToFolderName($this->data['path']);
    //$folderpath = $this->data['path'];
    //return end($folderpath);
  }

  function folderParent() {
    if(!isset($this->data['folderpath'])) return false;
    $folderpath = $this->data['folderpath'];
    $parts = explode('/', $folderpath);
    array_pop($parts);

    //

    if(empty($parts)) return false;
    return implode('/', $folderpath);
  }

  function folderParentName() {
    $folderpath = $this->data['folderpath'];
    array_pop($folderpath);
    return end($folderpath);
  }

  function files() {
    $pattern = config::get('root') . '/' . $this->folder() . "/*.{md,txt,jpg,gif,png}";
    return glob($pattern, GLOB_BRACE);
  }
}