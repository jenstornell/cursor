class Save {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
    this.options = params.options;
    this.time = this.time();

    console.log(this.time);
  }

  init() {
    this.events();
    this.startTimeout();
  }

  ajax() {
    let path = this.root + '/api/file/save';
    let data = {};
    data.id = $('[data-sc-active]').dataset.scName;
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
        this.messageError(text);
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          this.messageError(results.message);
        } else {
          latest = $('.editor textarea').value;
          this.render.updatePending();
          this.render.updateTimestamp(results.timestamp);
          this.messageOpen(results);
          this.resetTimeout();
          this.startTimeout();
        }
      }
    });
  }

  messageOpen(results) {
    message.open({
      text: results.message,
      type: 'success',
    });
  }

  messageError(msg) {
    message.open({
      text: msg,
      type: 'error',
    });
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
    if('autosave' in options && !options['autosave']) return false;

    let time = 10;
    if('autosave.interval' in options) {
      time = options['autosave.interval'];
    }
    return time * 1000;
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
      message.open({
        type: 'loading',
        autohide: false,
        openText: false
      });
      this.ajax();
    }
  }

  allowed() {
    return typeof document.body.dataset.pending !== 'undefined';
  }
}