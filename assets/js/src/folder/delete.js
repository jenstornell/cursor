class FolderDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }
  
  delete() {
    if(!confirm('Delete the current folder?')) return;
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
    console.log('path');
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/folder/delete';
    let data = {};
    let selector = $('[data-sc-type="folder"][data-sc-active]');
    if(!selector) return;
    let id = selector.dataset.scName;
    data.id = id;

    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
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
          staircase.delete(id, 'folder');
          staircase.select(staircase.dirname(id));
          
          delete $('ms-box').dataset.open;
        }
      }
    });
  }
}