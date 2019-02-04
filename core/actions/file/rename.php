<?php
class FileRename {
  function __construct($old_id, $new_filename) {
    $this->old_id = $old_id;
    $this->old_filepath = option('project.path') . '/' . $old_id;
    $this->old_filename = basename($this->old_id);

    $this->new_filename = $new_filename;
    if($this->contains('/', $old_id)) {
      $this->new_id = dirname($old_id) . '/' . $new_filename;
    } else {
      $this->new_id = $new_filename;
    }
    $this->new_path = dirname(option('project.path') . '/' . $old_id) . '/' . $new_filename;

    $this->extension = pathinfo($this->old_filepath, PATHINFO_EXTENSION);
  }

  function rename() {
    $this->onMissingFile();
    $this->onUnreadableFile();
    $this->onDisallowedFiletype();
    $this->onAlreadyExists();
    $this->onRename();
    $this->onSuccess();
  }

  function onMissingFile() {
    if(file_exists($this->old_filepath)) return;
    $this->json['message'] = 'Error! File does not exists!';
    $this->output(false);
  }

  function onUnreadableFile() {
    if(is_readable($this->old_filepath)) return;
    $this->json['message'] = 'Error! The file is not readable!';
    $this->output(false);
  }

  function onDisallowedFiletype() {
    $is_markdown = in_array($this->extension, filetypes::markdown());
    $is_image = in_array($this->extension, filetypes::image());

    if($is_markdown || $is_image) return;

    $this->json['message'] = 'This filetype is not allowed!';
    $this->output(false);
  }

  function onAlreadyExists() {
    if(!file_exists($this->new_path)) return;
    $this->json['message'] = 'Error! File already exists! Set another name!';
    $this->output(false);
  }

  function onRename() {
    if(rename($this->old_filepath, $this->new_path)) return;
    $this->json['message'] = 'Error! Could not rename file!';
    $this->output(false);
  }

  function onSuccess() {
    $this->json = [
      'old_id' => $this->old_id,
      'old_filename' => $this->old_filename,
      'old_filepath' => $this->old_filepath,
      'new_id' => $this->new_id,
      'new_filename' => $this->new_filename,
      'new_filepath' => $this->new_path,
    ];
    $this->output(true);
  }

  function contains($needle, $haystack) {
    return strpos($haystack, $needle) !== false;
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