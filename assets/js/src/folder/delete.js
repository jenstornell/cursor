class FolderDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }
  
  delete() {
    if(!confirm('Delete the current folder?')) return;
    message.open('loading', {autohide: false});
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/folder/delete';
    let data = {};
    let id = $('[data-sc-type="folder"][data-sc-active]').dataset.scName;
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

      let results = JSON.parse(text);

      if(!isJson(text)) {
        message.open(false, text);
      } else {
        if(!results.success) {
          message.open(false, results.message);
        } else {
          staircase.delete(id, 'folder');
          message.open();
        }
      }
    });
  }
}