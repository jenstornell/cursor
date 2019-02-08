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
      if(!confirm('The current file has not been saved. Load anyway?')) return;
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
        //console.log('click');
        let id = e.currentTarget.dataset.id;
        //console.log(id);
        //console.log('hello');
        staircase.open(id);
        /*let tree_el = $('[data-sc-name="' + id + '"]');

        $$('[data-sc-name]').forEach(el => {
          delete el.dataset.scActive;
        });

        if(!tree_el) return;

        this.openParent(tree_el);
        */
        this.get(id);

        //tree_el.dataset.scActive = '';
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
        } else {
          this.get(id);
          action = 'folder/read';
          buffer_id = id;
          staircase.open(id);
        }
      });
    });
  }

  openParent(el) {
    //console.log(el);
    let closest = el.parentNode.closest('li');

    if(!closest) return;
    
    closest.dataset.scState = 'open';
    this.openParent(closest);
  }
}