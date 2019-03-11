class FileUpload {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  init() {
    this.events();
  }

  events() {
    this.onClick();
    this.onChange();
  }

  onClick() {
    $('.filebar .upload-file').addEventListener('click', (e) => {
      this.upload();
    });
  }

  onChange() {
    $('#upload').addEventListener('change', (e) => {
      message.open('loading', {autohide: false});
      $('ms-box').dataset.autohide = '';
      this.ajax(e.target.files[0]);
    });
  }

  upload() {
    $('#upload').click();
  }

  ajax(file) {
    let path = this.root + '/api/file/upload';
    let data = new FormData();

    let folder = $('[data-sc-type="folder"][data-sc-active]');
    let id = '/';

    if(folder) {
      id = folder.dataset.scName;
    } else {
      let file = $('[data-sc-type="file"][data-sc-active]');
      if(file) {
        folder = file.closest('[data-sc-type="folder"]');
        if(folder) {
          id = folder.dataset.scName;
        }
      }
    }

    let match = '';
    let overwrite = false;

    if(id !== '/') {
      match = $('[data-sc-type="file"][data-sc-name="' + id + '/' + file.name + '"]');
    } else {
      match = $('[data-sc-type="file"][data-sc-name="' + file.name + '"]');
    }

    if(match) {
      overwrite = confirm('The file already exists. Overwrite it?');
      if(!overwrite) return;
    }
    
    data.append('file', file, file.name);
    data.append('id', id);
    data.append('overwrite', overwrite);

    let options = {
      method: 'post',
      body: data,
    };

    fetch(path, options)
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      if(!isJson(text)) {
        message.open(false, text);
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          message.open(false, results.message);
        } else {
          let join = staircase.join(id, file.name);
          staircase.add(join, 'file');
          this.resetInput();
          delete $('ms-box').dataset.open;
        }
      }
    });
  }

  resetInput() {
    $('#upload').value = '';
  }
}