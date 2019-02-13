class FilefolderRename {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
    this.filerename = new FileRename({
      root: this.root,
      options: this.options,
    });
    this.folderrename = new FolderRename({
      root: this.root,
      options: this.options,
    });
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

        if($('[data-sc-type="file"][data-sc-active]')) {
          this.filerename.rename();
        } else if($('[data-sc-type="folder"][data-sc-active]')) {
          this.folderrename.rename();
        }
      }
    });
  }
}