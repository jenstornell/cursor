<?php
class FileAdd {
  function __construct($folder_id) {
    $this->folder_id = $folder_id;
    $this->filename = 'untitled-' . time() . '.md';
    $this->filepath = option('project.path') . '/' . $this->folder_id . '/' . $this->filename;
  }

  function add() {
    if(file_exists($this->filepath)) {
      $this->json['message'] = 'Error! The file already exists!';
      $this->output(false);
    } elseif(file_put_contents($this->filepath, '') === false) {
      $this->json['message'] = 'Error! The file could not be created!';
      $this->output(false);
    }

    $this->json['filename'] = $this->filename;
    $this->output(true);
    //if
    /*
    if(!is_writable($this->filepath)) {
      $this->json['message'] = 'Error! The file is not writable!';
      $this->output(false);
    }
    if(!unlink($this->filepath)) {
      $this->json['message'] = 'Error! The file could not be deleted!';
      $this->output(false);
    }
    $this->output(true);
    */
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