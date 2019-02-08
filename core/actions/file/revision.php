<?php
class FileRevision {
  function __construct($post) {
    $this->post = $post;
    $this->id = $post['id'];
    $this->text = $post['text'];
    $this->filepath = option('project.path') . '/' . $post['id'];
    $this->filename = basename($this->filepath);
    $this->dirpath = dirname($this->filepath);
    $this->paths['revisions'] = $this->dirpath . '/' . option('revisions.folder');
    $this->paths['revision'] = $this->paths['revisions'] . '/' . $this->filename;
    $this->revision_filepath = $this->paths['revision'] . '/' . time();
    $this->json = [];
    $this->max = option('revisions.max');
  }

  function save() {
    if(!$this->max) return;

    if(!file_exists($this->paths['revisions'])) {
      $this->onFolderNotWritable('revisions');
      $this->onFolderNotWritten('revisions');
    }

    if(!file_exists($this->paths['revision'])) {
      $this->onFolderNotWritable('revision');
      $this->onFolderNotWritten('revision');
    }

    $filesave = new FileSave($this->post, 'revision', $this->revision_filepath);
    $filesave->save();

    $this->cleanup();
  }

  function onFolderNotWritable($type) {
    if(is_writable(dirname($this->paths[$type]))) return;
    $this->output(false, "Error! You don't have permission to create " . $type . " folder!");
  }

  function onFolderNotWritten($type) {
    if(mkdir($this->paths[$type], 0755, false) !== false) return;
    $this->output(false, "Error! The revision folder could not be added!");
  }

  function cleanup() {
    $files = array_filter(glob($this->paths['revision'] . "/*"), 'is_file');
    array_multisort(array_map('filemtime', $files), SORT_NUMERIC, SORT_DESC, $files);
    $files = array_slice($files, $this->max);
    foreach($files as $file) {
      if(file_exists($file)) {
        unlink($file);
      }
    }
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