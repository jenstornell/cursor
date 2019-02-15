class FileRead {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
    this.message = params.message;
  }

  get(id) {
    let pending = typeof document.body.dataset.pending !== 'undefined' ? true : false;
    if(pending) {
      if(!confirm('The current file has not been saved. Load anyway?')) {
        if(buffer_id === '') return;

        staircase.select(buffer_id, false);
        return;
      }
    }
    message.open('loading', {autohide: false});
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
        message.open(false, text);
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          message.open(false, results.message);
        } else {
          buffer_id = id;
          buffer_type = 'file';

          if(results.type == 'md') {
            this.toMarkdown(id, results);
          } else if(results.type == 'image') {
            this.toImage(id, results);
          }

          if(results.type == 'md' || results.type == 'image') {
            render.updateFilepath(id);
            render.updateFilesize(results.filesize);

            delete $('body').dataset.pending;
            delete $('ms-box').dataset.open;
          }
        }
      }
    });
  }

  toMarkdown(id, results) {
    let textarea = $('.editor textarea');
          
    textarea.value = results.text;
    latest = textarea.value;
    this.render.toPreview();

    $('body').dataset.state = 'markdown';

    render.updateCounter();
  }

  toImage(id, results) {
    $('body').dataset.state = 'image';
    $('.image img').setAttribute('src' , results.url);

    render.updateDimensions(results.dimensions);
  }
}