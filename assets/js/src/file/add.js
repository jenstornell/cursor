class FileAdd {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  init() {
    this.events();
  }

  events() {
    this.onClick();
  }

  onClick() {
    $('.filebar .add-file').addEventListener('click', (e) => {
      this.add();
    });
  }

  add() {
    let pending = typeof document.body.dataset.pending !== 'undefined' ? true : false;
    if(pending) {
      if(!confirm('Add: The current file has not been saved. Load anyway?')) {
        if(buffer_id === '') return;

        action = 'file/add/abort';

        staircase.removeActive();
        staircase.select(buffer_id);
        return;
      }
    }
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
    this.ajax();
  }

  newId(id, filename) {
    return (id == '/') ? filename : id + '/' + filename;
  }

  ajax() {
    let path = this.root + '/api/file/add';
    let data = {};
    let folder = $('[data-sc-type="folder"][data-sc-active]');
    let id = '/';

    if(folder) {
      id = folder.dataset.scName;
    } else {
      let file = $('[data-sc-type="file"][data-sc-active]');
      if(file) {
        folder = file.closest('[data-sc-type="folder"]');
        if(folder) {
          id = folder.dataset.scName;
        }
      }
    }

    data.id = id;

    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      let results = JSON.parse(text);
      if(!isJson(text)) {
        message.open(false, text);
      } else {
        if(!results.success) {
          message.open(false, results.message);
        } else {
          if(id !== '/') {
            staircase.open(id);
          }

          let join = staircase.join(id, results.filename);
          staircase.add(join, 'file');

          delete $('body').dataset.pending;
          delete $('ms-box').dataset.open;

          action = 'file/add';
          buffer_id = join;

          let item = $('[data-sc-name="' + buffer_id + '"] .sc-name');
          if(item) {
            item.scrollIntoView({behavior: 'smooth'});
            staircase.select(join);
          }
        }
      }
    });
  }
}