class FileDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  delete() {
    if(!confirm('Delete the current file?')) return;
    message.open('loading', {autohide: false});
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/file/delete';
    let data = {};
    let id = $('[data-sc-type="file"][data-sc-active]').dataset.scName;
    data.id = id;

    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      message.open(false, text);

      console.log(path);

      let results = JSON.parse(text);

      if(!isJson(text)) {
        message.open(false, text);
      } else {
        if(!results.success) {
          message.open(false, results.message);
        } else {
          staircase.delete(id, 'file');
          message.open();
        }
      }
    });
  }
}