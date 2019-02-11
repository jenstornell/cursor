<?php
class FolderAdd {
  function __construct($id) {
    $this->id = $id;
    $this->name = 'untitled-' . time();
    $this->path = option('project.path') . '/' . $this->id . '/' . $this->name;
  }

  function add() {
    if(file_exists($this->path)) {
      $this->json['message'] = 'Error! The folder already exists!';
      $this->output(false);
    } elseif(mkdir($this->path) === false) {
      $this->json['message'] = 'Error! The folder could not be created!';
      $this->output(false);
    }

    $this->json['name'] = $this->name;
    $this->output(true);
  }

  function output($success = false, $message = null) {
    $this->json['success'] = $success;

    if($message) {
      $this->json['message'] = $this->message;
    }
    echo json_encode($this->json);
    die;
  }
}