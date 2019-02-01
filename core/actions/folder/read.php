<?php
class FolderRead {
  function __construct($id) {
    $this->id = $id;
    $this->filepath = option('project.path') . '/' . $id;
    $this->extension = pathinfo($this->filepath, PATHINFO_EXTENSION);
    $this->json = [];
  }

  function read() {
    $this->onMssingFolder();
    $this->onSuccess();
  }

  function onMssingFolder() {
    if(file_exists($this->filepath)) return;
    $this->output(false, 'Error! Folder does not exists!');
  }

  function onSuccess() {
    $this->json['html'] = snippet('browser', ['root' => $this->filepath]);
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