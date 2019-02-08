<?php
class FileSave {
  function __construct($post, $type = 'file', $filepath = null) {
    $this->id = $post['id'];
    $this->type = $type;
    $this->text = $post['text'];
    $this->filepath = ($filepath) ? $filepath : option('project.path') . '/' . $post['id'];
    $this->json = [];
  }

  function save() {
    if($this->type == 'file') {
      $this->onMissingFile();
      $this->onNotWritable();
    }
    $this->onNotWritten();
    $this->onNotEqual();
    return $this->success();
  }

  function onMissingFile() {
    if(file_exists($this->filepath)) return;
    $this->output(false, 'Error! ' . ucfirst($this->type) . ' does not exist!');
  }

  function onNotWritable() {
    if(is_writable($this->filepath)) return;
    $this->output(false, "Error! You don't have permission to save the " . $this->type . "!");
  }

  function onNotWritten() {
    $this->content = file_put_contents($this->filepath, $this->text);
    if($this->content !== false) return;
    $this->output(false, 'Error! The ' . $this->type . ' could not be saved!');
  }

  function onNotEqual() {
    if(file_get_contents($this->filepath) === $this->text) return;
    $this->output(false, 'Error! ' . ucfirst($this->type) . ' is not equal to the input!');
  }

  function success() {
    $this->json = [
      'success' => true,
      'timestamp' => date('H:i:s'),
    ];
    $this->output = json_encode($this->json);
  }

  function get() {
    return $this->output;
  }

  function output($success = false, $message = null) {
    $this->json['success'] = $success;

    if($message) {
      $this->json['message'] = $message;
    }
    echo json_encode($this->json);
    die;
  }
}