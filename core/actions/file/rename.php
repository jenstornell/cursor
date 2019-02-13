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
    $this->revisions = dirname(option('project.path') . '/' . $old_id) . '/' . option('revisions.folder');
    $this->new_revision = $this->revisions . '/' . $new_filename;
    $this->old_revision = $this->revisions . '/' . $this->old_filename;
    $this->new_extension = pathinfo($this->new_path, PATHINFO_EXTENSION);
  }

  function rename() {
    $this->onMissingFile();
    $this->onUnreadableFile();
    $this->onDisallowedFiletype();
    $this->onAlreadyExists();
    $this->onRename();

    $this->renameRevision();

    $this->onSuccess();
  }

  function renameRevision() {
    if(!option('revisions.max')) return;
    if(!file_exists($this->old_revision)) return;
    if(file_exists($this->new_revision)) return;
    if(!is_readable($this->revisions)) {
      $this->json['message'] = "Error! Could not rename revision folder, because it's not readable!";
      $this->output(false);
    }

    if(rename($this->old_revision, $this->new_revision)) return;
    $this->json['message'] = 'Error! Could not rename revision folder!';
    $this->output(false);
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
    $is_markdown = in_array($this->new_extension, filetypes::markdown());
    $is_image = in_array($this->new_extension, filetypes::image());

    /*echo $this->extension;
    echo $is_markdown . "#";
    echo $is_image;*/

    if($is_markdown || $is_image) return;

    $this->json['message'] = "Error! You can't rename the file to this filetype!";
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
    $old_folder = (contains('/', $this->old_id)) ? dirname($this->old_id) . '/' : '';
    $this->json = [
      'old_id' => $this->old_id,
      'old_revision' => $old_folder . option('revisions.folder') . '/' . $this->old_filename,
      'new_filename' => $this->new_filename,
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