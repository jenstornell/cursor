<?php
class FileUpload {
  function __construct($id, $overwrite) {
    $this->file = $_FILES['file'];
    $this->id = $id;
    $this->overwrite = $overwrite;
    $this->path = trim(option('project.path') . '/' . $id, '/') . '/' . $this->file['name'];
  }

  function upload() {
    if(file_exists($this->path) && !$this->overwrite) {
      $this->json['message'] = 'Error! Image already exists.';
      $this->output(false);
    } elseif($this->file['error'] !== 0) {
      $this->json['message'] = 'Error! Image could not be uploaded. ' . $this->file['error'];
      $this->output(false);
    } else {
      $content = file_get_contents($this->file['tmp_name']);
      if(!$content) {
        $this->json['message'] = 'Error! Image is not readable.';
        $this->output(false);
      } elseif(!file_put_contents($this->path, $content)) {
        $this->json['message'] = 'Error! Image could not be written.';
        $this->output(false);
      }
    }

    $this->output(true);
    die;
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