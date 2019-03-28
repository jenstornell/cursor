class Render {
  constructor(params) {
    this.options = params.options;
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.toPreview();
      this.events();
    });
  }

  events() {
    this.onKeyUp();
    this.onClickWrapper();
  }

  onKeyUp() {
    editor.on('change', (e) => {
      this.toPreview(this.options['root.url']);
      this.updateCounter();
      this.updatePending();
    });
  }

  onClickWrapper() {
    console.log('test');
    $('.editor').addEventListener('click', (e) => {
      if(e.target !== e.currentTarget) return
      editor.focus();
    });
  }

  updateCounter() {
    let code = editor.getValue();
    code = code.replace(/(\r\n|\n|\r)/gm, ' ');

    let char_count = code.length;
    let word_count = code.split(' ').filter(function(n) { return n != '' }).length;

    $('.count').innerHTML = word_count + ' words, ' + char_count + ' chars ';
  }

  updateFilepath(id) {
    let filename = id.substring(id.lastIndexOf('/')+1);
    let dirpath = id.split("/").slice(0,-1).join("/");
    if(dirpath) {
      $('[data-path] span').innerHTML = dirpath + '/';
    } else {
      $('[data-path] span').innerHTML = '';
    }
    $('[data-path] input').value = filename;
  }

  updatePending() {
    let value = editor.getValue();

    if(value === latest) {
      delete document.body.dataset.pending;
    } else {
      document.body.dataset.pending = '';
    }
  }

  updateTimestamp(timestamp) {
    $('.timestamp').innerHTML = '<strong>Saved:</strong> ' + timestamp;
  }

  updateDimensions(dimensions) {
    $('.dimensions').innerHTML = '<strong>Dimensions:</strong> ' + dimensions;
  }

  updateFilesize(filesize) {
    $('.filesize').innerHTML = '<strong>Filesize:</strong> ' + filesize;
  }

  updateRevisionsCount(revisions_count) {
    $('.revisions_count').innerHTML = '<strong>Revisions:</strong> ' + revisions_count;
  }

  toPreview(root) {
    let folder = (buffer_id !== '') ? staircase.dirname(buffer_id) : '/';
    let value = editor.getValue();
    let base = staircase.join(root + '/api/image', folder) + '/';

    const renderer = new marked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
      const html = linkRenderer.call(renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };

    let markdown = marked(value, {
      baseUrl: base,
      renderer: renderer,
    });
    $('.preview').innerHTML = markdown;
  }
}