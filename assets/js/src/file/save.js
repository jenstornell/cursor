class Save {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
    this.options = params.options;
    this.time = this.time();
  }

  init() {
    this.events();
    this.startTimeout();
  }

  ajax() {
    let path = this.root + '/api/file/save';
    let data = {};
    let id = $('[data-sc-active]').dataset.scName;
    data.id = id;
    data.text = $('.editor textarea').value;

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
          latest = $('.editor textarea').value;
          this.render.updatePending();
          this.render.updateTimestamp(results.timestamp);

          let revisions_id = (!this.dirname(id)) ? '' : this.dirname(id) + '/';
          revisions_id += options['revisions.folder'] + '/' + this.basename(id);

          staircase.refresh(revisions_id);
          message.open();
          this.resetTimeout();
          this.startTimeout();
        }
      }
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

  events() {
    this.onCtrlS();
  }

  onCtrlS() {
    window.addEventListener('keydown', (e) => {
      if(!e.ctrlKey) return;
      if(e.code !== 'KeyS') return;
      e.preventDefault();
      this.save();
    });
  }

  time() {
    if(!options['autosave']) return false;
    return options['autosave.interval'] * 1000;
  }

  startTimeout() {
    if(!this.time) return;
    this.clock = setTimeout(() => {
      this.save();
    },this.time);
  }

  resetTimeout() {
    clearTimeout(this.clock);
  }

  save() {
    if(!this.allowed()) {
      this.startTimeout();
    } else {
      message.open('loading', {autohide: false});
      this.ajax();
    }
  }

  allowed() {
    return typeof document.body.dataset.pending !== 'undefined';
  }
}