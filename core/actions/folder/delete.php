<?php
class FolderDelete {
  function __construct($id) {
    $this->id = $id;
    $this->path = option('project.path') . '/' . $id;
  }

  function delete() {
    if(!is_writable($this->path)) {
      $this->json['message'] = 'Error! The folder is not writable!';
      $this->output(false);
    }
    if(!is_dir_empty($this->path)) {
      $this->json['message'] = 'Error! The folder is not empty!';
      $this->output(false);
    }
    if(!rmdir($this->path)) {
      $this->json['message'] = 'Error! The folder could not be deleted!';
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