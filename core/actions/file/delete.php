<?php
class FileDelete {
  function __construct($id) {
    $this->id = $id;
    $this->filepath = option('project.path') . '/' . $id;
  }

  function delete() {
    if(!is_writable($this->filepath)) {
      $this->json['message'] = 'Error! The file is not writable!';
      $this->output(false);
    }
    if(!unlink($this->filepath)) {
      $this->json['message'] = 'Error! The file could not be deleted!';
      $this->output(false);
    }
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