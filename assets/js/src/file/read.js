class FileRead {
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
    let path = this.root + '/api/file/read';
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
        } else if(results.type == 'md') {
          this.toMarkdown(results);
        } else if(results.type == 'image') {
          this.toImage(results);
        }
      }
    });
  }

  toMarkdown(results) {
    let textarea = $('.editor textarea');
          
    textarea.value = results.text;
    latest = textarea.value;
    this.render.toPreview();

    $('body').dataset.state = 'markdown';

    render.updateCounter();
    render.updateFilepath(id);
    render.updateFilesize(results.filesize);

    delete $('body').dataset.pending;
    delete $('ms-box').dataset.open;
  }

  toImage() {
    $('body').dataset.state = 'image';
    $('.image img').setAttribute('src' , results.url);

    render.updateFilepath(id);
    render.updateDimensions(results.dimensions);
    render.updateFilesize(results.filesize);
    
    delete $('body').dataset.pending;
    delete $('ms-box').dataset.open;
  }

  messageError(msg) {
    message.open({
      text: msg,
      type: 'error',
    });
  }
}