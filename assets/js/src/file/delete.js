class FileDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  delete() {
    if(!confirm('Delete the current file and the current file revisions?')) return;
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
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
      if(!isJson(text)) {
        message.open(false, text);
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          message.open(false, results.message);
        } else {
          staircase.delete(id, 'file');
          staircase.delete(results.revisions_id, 'folder');

          delete $('ms-box').dataset.open;
          delete $('body').dataset.pending;
        }
      }
    });
  }
}