class Render {
  constructor() {

  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.toPreview();
      this.events();
    });
  }

  events() {
    this.onKeyUp();
  }

  onKeyUp() {
    $('textarea').addEventListener('keyup', (e) => {
      this.toPreview();
      this.updateCounter();
      this.updatePending();
    });
  }

  updateCounter() {
    Countable.count($('.editor textarea'), counter => {
      $('.count').innerHTML = counter.words + ' words, ' + counter.all + ' chars ';
    });
  }

  updateFilepath(id) {
    let filename = id.substring(id.lastIndexOf('/')+1);
    let dirpath = id.split("/").slice(0,-1).join("/");
    if(dirpath) {
      $('[data-path] span').innerHTML = dirpath + '/';
    }
    $('[data-path] input').value = filename;
  }

  updatePending() {
    let value = $('.editor textarea').value;
    if(value === latest) {
      delete document.body.dataset.pending;
    } else {
      document.body.dataset.pending = '';
    }
  }

  updateTimestamp(timestamp) {
    $('.timestamp').innerHTML = 'saved ' + timestamp;
  }

  updateDimensions(dimensions) {
    $('.dimensions').innerHTML = dimensions;
  }

  updateFilesize(filesize) {
    $('.filesize').innerHTML = filesize;
  }

  toPreview() {
    $('.preview').innerHTML = marked($('textarea').value, {
      baseUrl: 'test'
    });
  }
}