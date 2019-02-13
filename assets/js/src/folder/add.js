class FolderAdd {
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
    $('.filebar .add-folder').addEventListener('click', (e) => {
      this.add();
    });
  }

  add() {
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/folder/add';
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
      message.open(false, text);

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
          staircase.add(id, results.name, 'folder');
          delete $('ms-box').dataset.open;
        }
      }
    });
  }
}