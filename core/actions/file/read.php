<?php
class FileRead {
  function __construct($id) {
    $this->id = $id;
    $this->filepath = option('project.path') . '/' . $id;
    $this->extension = pathinfo($this->filepath, PATHINFO_EXTENSION);
  }

  function read() {
    $this->onMissingFile();
    $this->onUnreadableFile();
    $this->onDisallowedFiletype();
    $this->onSuccess();
  }

  function onMissingFile() {
    if(file_exists($this->filepath)) return;
    $this->json['message'] = 'Error! File does not exists!';
    $this->output(false);
  }

  function onUnreadableFile() {
    $this->content = file_get_contents($this->filepath);
    if($this->content !== false) return;
    $this->json['message'] = 'Error! The file could not be loaded!';
    $this->output(false);
  }

  function onDisallowedFiletype() {
    $is_markdown = in_array($this->extension, filetypes::markdown());
    $is_image = in_array($this->extension, filetypes::image());

    if($is_markdown || $is_image) return;

    $this->json['message'] = 'This filetype is not allowed!';
    $this->output(false);
  }

  function onSuccess() {
    if(in_array($this->extension, filetypes::markdown())) {
      $this->successMarkdown();
    } elseif(in_array($this->extension, filetypes::image())) {
      $this->successImage();
    }
  }

  function successMarkdown() {
    $this->json = [
      'message' => 'The file ' . $this->id . ' loaded successfully!',
      'text' => $this->content,
      'type' => 'md',
      'filesize' => humanFilesize(filesize($this->filepath)),
    ];
    $this->output(true);
  }

  function successImage() {
    $url = option('root.url') . '/api/image/' . $this->id;
    list($width, $height) = getimagesize($this->filepath);

    $this->json = [
      'message' => sprintf('The file % loaded successfully!', $this->id),
      'url' => $url,
      'type' => 'image',
      'filesize' => humanFilesize(filesize($this->filepath)),
      'success' => true,
      'dimensions' => "$width x  $height",
    ];
    $this->output(true);
  }

  function output($success = false) {
    $this->json['success'] = $success;
    echo json_encode($this->json);
    die;
  }
}