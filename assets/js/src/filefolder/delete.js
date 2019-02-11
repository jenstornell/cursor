class FilefolderDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
    this.filedelete = new FileDelete({
      root: this.root,
      options: this.options,
    });
    this.folderdelete = new FolderDelete({
      root: this.root,
      options: this.options,
    });
  }

  init() {
    this.events();
  }

  events() {
    this.onClick();
  }

  onClick() {
    $('.filebar .delete').addEventListener('click', (e) => {
      if($('[data-sc-type="file"][data-sc-active]')) {
        this.filedelete.delete();
      } else {
        this.folderdelete.delete();
      }
    });
  }
}