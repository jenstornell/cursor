<?php
class FileSave {
  function __construct($post) {
    $this->id = $post['id'];
    $this->text = $post['text'];
    $this->filepath = option('project.path') . '/' . $post['id'];
    $this->json = [];
  }

  function save() {
    $this->onMissingFile();
    $this->onNotWritable();
    $this->onNotWritten();
    $this->onNotEqual();
    $this->success();
  }

  function onMissingFile() {
    if(file_exists($this->filepath)) return;
    $this->output(false, 'Error! File does not exist!');
  }

  function onNotWritable() {
    if(is_writable($this->filepath)) return;
    $this->output(false, "Error! You don't have permission to save the file!");
  }

  function onNotWritten() {
    $this->content = file_put_contents($this->filepath, $this->text);
    if($this->content !== false) return;
    $this->output(false, 'Error! The file could not be saved!');
  }

  function onNotEqual() {
    if(file_get_contents($this->filepath) === $this->text) return;
    $this->output(false, 'Error! File is not equal to the input!');
  }

  function success() {
    $this->json = [
      'timestamp' => date('H:i:s'),
    ];
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