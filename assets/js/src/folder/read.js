class FolderRead {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
    this.message = params.message;
  }

  get(id) {
    let pending = typeof document.body.dataset.pending !== 'undefined' ? true : false;
    if(pending) {
      if(!confirm('The current file has not been saved. Load anyway?')) return;
    }
    message.open({
      type: 'loading',
      autohide: false,
      openText: false
    });
    $('ms-box').dataset.autohide = '';
    this.ajax(id);
  }

  ajax(id) {
    let path = this.root + '/api/folder/read';
    let data = {};
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
        this.messageError(text);
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          this.messageError(results.message);
        } else {
          //this.toImage(results);
          console.log(results);
          $('body').dataset.state = 'browser';
          $('.browser').innerHTML = results.html;
        }
      }
    });
  }

  messageError(msg) {
    message.open({
      text: msg,
      type: 'error',
    });
  }
}