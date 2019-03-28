class FileRead {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
    this.message = params.message;
    this.options = options;
  }

  get(id, question = true) {
    let pending = typeof document.body.dataset.pending !== 'undefined' ? true : false;
    if(pending) {
      if(question && !confirm('Read file: The current file has not been saved. Load anyway?')) {
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
            this.toMarkdown(results);
            editor.refresh();
          } else if(results.type == 'image') {
            this.toImage(id, results);
          }

          if(results.type == 'md' || results.type == 'image') {
            this.render.updateFilepath(id);
            this.render.updateFilesize(results.filesize);
            this.render.updateRevisionsCount(results.revisions_count);
            this.render.updateCounter();
            this.render.updateTimestamp(results.timestamp);

            if(action == 'file/add') {
              let input = document.querySelector('[data-path] input');
              input.focus();
              input.select();
            } else {
              editor.focus();
            }

            delete $('body').dataset.pending;
            delete $('ms-box').dataset.open;
          }
        }

        action = '';
      }
    });
  }

  toMarkdown(results) {
    latest = results.text;
    editor.setValue(results.text);
    this.render.toPreview(this.options['root.url']);

    $('body').dataset.state = 'markdown';

    render.updateCounter();
  }

  toImage(id, results) {
    $('body').dataset.state = 'image';
    $('.image img').setAttribute('src' , results.url);

    render.updateDimensions(results.dimensions);
  }
}