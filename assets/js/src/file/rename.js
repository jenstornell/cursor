class FileRename {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
  }

  init() {
    this.events();
  }

  events() {
    this.onChange();
  }

  onChange() {
    $('.topbar .path input').addEventListener('keyup', (e) => {
      if(e.code == 'Enter') {
        e.target.blur();
        this.rename();
      }
    });
  }

  rename() {
    if(!confirm('Rename the current file?')) return;
    message.open('loading', {autohide: false});
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/file/rename';
    let data = {};
    data.id = $('[data-sc-active]').dataset.scName;
    data.filename = $('[data-path] input').value;

    message.open('loading', {autohide: false});

    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      message.open(false, text);

      let results = JSON.parse(text);

      if(!isJson(text)) {
        message.open(false, text);
      } else {
        if(!results.success) {
          message.open(false, results.message);
        } else {
          console.log(results);
          let el = $('[data-sc-name="' + results.old_id + '"]');
          el.dataset.scName = results.new_id;
          $('.sc-name', el).innerHTML = results.new_filename;
          message.open();
        }
      }
    });
  }
}