class FolderRead {
  constructor(params) {
    this.render = params.render;
    this.fileread = params.fileread;
    this.root = params.root;
    this.message = params.message;
  }

  get(id) {
    let pending = typeof document.body.dataset.pending !== 'undefined' ? true : false;
    if(pending) {
      if(!confirm('The current file has not been saved. Load anyway?')) {
        if(buffer_id === '') return;

        staircase.removeActive();
        staircase.select(buffer_id, buffer_type, false);
        return;
      }
    }
    message.open('loading', {autohide: false});
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
        message.open(false, text);
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          message.open(false, results.message);
        } else {
          $('body').dataset.state = 'browser';
          $('.browser').innerHTML = results.html;
          render.updateFilepath(id);
          buffer_id = id;
          buffer_type = 'folder';
          delete $('body').dataset.pending;
          delete $('ms-box').dataset.open;
          this.onClick();
        }
      }
    });
  }

  onFolderClick() {
    $$('.browser [data-folder]').forEach(el => {
      el.dataset.scActive = '';
      el.addEventListener('click', (e) => {
        let id = e.currentTarget.dataset.id;
        staircase.open(id);
        this.get(id);
      });
    });
  }

  onClick() {
    $$('.browser [data-id]').forEach(el => {
      el.dataset.scActive = '';
      el.addEventListener('click', (e) => {
        let type = el.dataset.type;
        let id = e.currentTarget.dataset.id;

        if(type == 'file') {
          this.fileread.get(id);
          staircase.open(this.dirname(id));
          //staircase.select(id, 'file');
        } else {
          this.get(id);
          action = 'folder/read';
          buffer_id = id;
          staircase.open(id);
        }
      });
    });
  }

  trimSlashes(str) {
    return str.replace(/^\/+|\/+$/g, '');
  };

  basename(path) {
    return path.replace(/.*\//, '');
  }

  dirname(path) {
    let dirname = path.match(/.*\//);
    if(dirname && dirname.length) return this.trimSlashes(dirname[0]);
  }

  openParent(el) {
    let closest = el.parentNode.closest('li');

    if(!closest) return;
    
    closest.dataset.scState = 'open';
    this.openParent(closest);
  }
}