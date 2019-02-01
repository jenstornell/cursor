<?php
class fileRename {
  private $old_name;
  private $new_name;
  private $old_path;
  private $new_path;
  private $folderpath;

  function rename($json) {
    $data = json_decode($json);
    $this->folderpath = path::folderPath($data->folderpath);

    $this->old_name = slug($data->old_filename . '.' . $data->extension);
    $this->new_name = slug($data->new_filename . '.' . $data->extension);

    $this->old_path = $this->folderpath . '/' . $data->old_filename;
    $this->new_path = $this->folderpath . '/' . $data->new_filename;

    echo $this->new_name;
    echo $this->folderpath;

    echo $this->setName();

    if($this->setName() === true) $this->renameRevision();
  }

  function setName() {
    if(empty($this->new_name)) return 'Error! You did not write a filename!';
    elseif(file_exists($this->new_path)) return 'Error! The file already exists!';
    elseif(!is_writable($this->folderpath)) return "Error! You don't have permission to rename the file!";
    //elseif(!rename($this->old_path, $this->new_path)) return "Error! The file could not be renamed!";

    return true;
  }

  function renameRevision() {
    echo 'test111';
    die;
    $revision_folder = path::revisionFolder();

    if(file_exists($revision_folder)) {
      if(is_writable($revision_folder)) {
        $rename = rename($revision_folder, path::revisions() . '/' . slug($_POST['file-name']) . '_' . $_POST['file-extension']);
        if(!$rename)
          $error = "Error! The revisions folder could not be renamed!";
      }
    }
    header("Location: " . url::folderUrl() . '&file=' . $filename);
    die();
  }
}