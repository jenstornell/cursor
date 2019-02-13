<?php
class FileDelete {
  function __construct($id) {
    $this->id = $id;
    $this->filepath = option('project.path') . '/' . $id;
    $this->filename = basename($id);
    $this->revisionspath = dirname($this->filepath) . '/' . option('revisions.folder') . '/' . $this->filename;

    if(contains('/', $id)) {
      $this->revisions_id = dirname($id) . '/' . option('revisions.folder') . '/' . $this->filename;
    } else {
      $this->revisions_id = option('revisions.folder') . '/' . $this->filename;
    }
  }

  function delete() {
    if(!is_writable($this->filepath)) {
      $this->json['message'] = 'Error! The file is not writable!';
      $this->output(false);
    } elseif(!unlink($this->filepath)) {
      $this->json['message'] = 'Error! The file could not be deleted!';
      $this->output(false);
    } elseif(!$this->deleteRevisions()) {
      $this->json['message'] = 'Error! File revisions folder could not be deleted!';
      $this->output(false);
    }

    $this->json['revisions_id'] = $this->revisions_id;
    $this->output(true);
  }

  function deleteRevisions() {
    if(!file_exists($this->revisionspath)) return true;

    $success = true;
    $glob = glob($this->revisionspath . '/*');
    if($glob) {
      foreach(glob($this->revisionspath . '/*') as $item) {
        if(!unlink($item)) {
          $success = false;
        }
      }
    }
    
    if(!$success || !is_dir_empty($this->revisionspath)) {
      $this->json['message'] = 'Error! File revisions could not be deleted!';
      $this->output(false);
    }
    return rmdir($this->revisionspath);
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