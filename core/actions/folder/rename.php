<?php
class FolderRename {
  function __construct($old_id, $new_name) {
    $this->old_id = $old_id;
    $this->old_filepath = option('project.path') . '/' . $old_id;
    $this->old_filename = basename($this->old_id);

    $this->new_name = $new_name;
    if(contains('/', $old_id)) {
      $this->new_id = dirname($old_id) . '/' . $new_name;
    } else {
      $this->new_id = $new_name;
    }
    $this->new_path = dirname(option('project.path') . '/' . $old_id) . '/' . $new_name;
  }

  function rename() {
    if(!file_exists($this->old_filepath)) {
      $this->json['message'] = 'Error! The folder does not exists!';
      $this->output(false);
    }
    if(!is_readable($this->old_filepath)) {
      $this->json['message'] = 'Error! The folder is not readable!';
      $this->output(false);
    }
    if(file_exists($this->new_path)) {
      $this->json['message'] = 'Error! The folder name is already taken!';
      $this->output(false);
    }
    if(!rename($this->old_filepath, $this->new_path)) {
      $this->json['message'] = 'Error! The folder could not be renamed!';
      $this->output(false);
    }
    $old_folder = (contains('/', $this->old_id)) ? dirname($this->old_id) . '/' : '';
    $this->json = [
      'old_id' => $this->old_id,
      'new_name' => $this->new_name,
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