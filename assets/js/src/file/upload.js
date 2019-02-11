class FileUpload {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  init() {
    this.events();
    console.log('upload');
  }

  events() {
    this.onClick();
    this.onChange();
  }

  onClick() {
    $('.filebar .upload-file').addEventListener('click', (e) => {
      this.add();
    });
  }

  onChange() {
    $('#upload').addEventListener('change', (e) => {
      this.ajax(e.target.files[0]);
    });
  }

  add() {
    $('#upload').click();
  }

  ajax(file) {
    let path = this.root + '/api/file/upload';
    let data = new FormData();

    data.append('file', file);

    let options = {
      method: 'post',
      body: data,
    };

    fetch(path, options)
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      message.open(false, text);
      console.log(text);

      /*let results = JSON.parse(text);
      if(!isJson(text)) {
        message.open(false, text);
      } else {
        if(!results.success) {
          message.open(false, results.message);
        } else {
          staircase.add(id, results.filename, 'file');
          message.open();
        }
      }*/
    });
  }
}