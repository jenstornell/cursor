class Fullscreen {
  init() {
    this.events();
  }

  events() {
    this.onClick();
    this.onFullscreen();
  }

  onClick() {
    $('.fullscreen').addEventListener('click', () => {
      this.toggleFullScreen();
    });
  }

  onFullscreen() {
    document.addEventListener("fullscreenchange", (e) => {
      if(document.fullscreenElement) {
        $('aside').dataset.hide = '';
      } else {
        delete $('aside').dataset.hide;
      }
    });
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
      }
    }
  }
}
function $(selector, base = null) {
  base = (base === null) ? document : base;
  return base.querySelector(selector);
}

function $$(selector, base = null) {
  base = (base === null) ? document : base;
  return base.querySelectorAll(selector);
}

function dblclick(el) {
  let e = new MouseEvent('dblclick', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  el.dispatchEvent(e);
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function basename(path) {
  return path.replace(/.*\//, '');
}

function dirname(path) {
  let dirname = path.match(/.*\//);
  if(dirname && dirname.length) return this.trimSlashes(dirname[0]);
}

function trimSlashes(str) {
  return str.replace(/^\/+|\/+$/g, '');
};
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
    //this.onOutsideSelected();
  }

  /*onOutsideSelected() {
    document.addEventListener('click', (e) => {
      if(e.target.classList.contains('sc-name')) return;

      let li = $('[data-sc-active]');

      if(!li) return;

      let type = li.dataset.scType;
      let id = li.dataset.scName;
      staircase.deselect(id, type);
    });
  }*/

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
    $('.preview').innerHTML = marked($('textarea').value);
  }
}
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
      if(!confirm('The current file has not been saved. Load anyway?')) {
        if(buffer_id === '') return;

        staircase.removeActive();
        staircase.select(buffer_id, buffer_type, false);
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
          
          staircase.add(id, results.filename, 'file');
          delete $('body').dataset.pending;
          delete $('ms-box').dataset.open;
        }
      }
    });
  }
}
class FileDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  delete() {
    if(!confirm('Delete the current file and the current file revisions?')) return;
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/file/delete';
    let data = {};
    let id = $('[data-sc-type="file"][data-sc-active]').dataset.scName;
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
          staircase.delete(id, 'file');
          staircase.delete(results.revisions_id, 'folder');

          if(dirname(id)) {
            staircase.select(dirname(id), 'folder');
          }

          delete $('ms-box').dataset.open;
          delete $('body').dataset.pending;
        }
      }
    });
  }
}
class FileRead {
  constructor(params) {
    this.render = params.render;
    this.root = params.root;
    this.message = params.message;
  }

  get(id) {
    let pending = typeof document.body.dataset.pending !== 'undefined' ? true : false;
    if(pending) {
      if(!confirm('The current file has not been saved. Load anyway?')) {
        if(buffer_id === '') return;

        staircase.removeActive();
        staircase.select(buffer_id, buffer_type, false);
        return;
      }
    }
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
    this.ajax(id);
  }

  ajax(id) {
    let path = this.root + '/api/file/read';
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
          buffer_id = id;
          buffer_type = 'file';

          if(results.type == 'md') {
            this.toMarkdown(id, results);
          } else if(results.type == 'image') {
            this.toImage(id, results);
          }
        }
      }
    });
  }

  toMarkdown(id, results) {
    let textarea = $('.editor textarea');
          
    textarea.value = results.text;
    latest = textarea.value;
    this.render.toPreview();

    $('body').dataset.state = 'markdown';

    render.updateCounter();
    render.updateFilepath(id);
    render.updateFilesize(results.filesize);

    delete $('body').dataset.pending;
    delete $('ms-box').dataset.open;
  }

  toImage(id, results) {
    $('body').dataset.state = 'image';
    $('.image img').setAttribute('src' , results.url);

    render.updateFilepath(id);
    render.updateDimensions(results.dimensions);
    render.updateFilesize(results.filesize);
    
    delete $('body').dataset.pending;
    delete $('ms-box').dataset.open;
  }
}
class FileRename {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  rename() {
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
          staircase.rename(results.old_id, results.new_filename, 'file');
          staircase.rename(results.old_revision, results.new_filename, 'folder');
          message.open();
        }
      }
    });
  }
}
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
class FileUpload {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  init() {
    this.events();
  }

  events() {
    this.onClick();
    this.onChange();
  }

  onClick() {
    $('.filebar .upload-file').addEventListener('click', (e) => {
      this.upload();
    });
  }

  onChange() {
    $('#upload').addEventListener('change', (e) => {
      message.open('loading', {autohide: false});
      $('ms-box').dataset.autohide = '';
      this.ajax(e.target.files[0]);
    });
  }

  upload() {
    $('#upload').click();
  }

  ajax(file) {
    let path = this.root + '/api/file/upload';
    let data = new FormData();

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

    let match = '';
    let overwrite = false;

    if(id !== '/') {
      match = $('[data-sc-type="file"][data-sc-name="' + id + '/' + file.name + '"]');
    } else {
      match = $('[data-sc-type="file"][data-sc-name="' + file.name + '"]');
    }

    if(match) {
      overwrite = confirm('The file already exists. Overwrite it?');
      if(!overwrite) return;
    }
    
    data.append('file', file, file.name);
    data.append('id', id);
    data.append('overwrite', overwrite);

    let options = {
      method: 'post',
      body: data,
    };

    fetch(path, options)
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
          staircase.add(id, file.name, 'file');
          $('#upload').value = '';
          delete $('ms-box').dataset.open;
        }
      }
    });
  }
}
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
class FolderDelete {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }
  
  delete() {
    if(!confirm('Delete the current folder?')) return;
    message.open('loading', {autohide: false});
    $('ms-box').dataset.autohide = '';
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/folder/delete';
    let data = {};
    let id = $('[data-sc-type="folder"][data-sc-active]').dataset.scName;
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
          staircase.delete(id, 'folder');

          if(dirname(id)) {
            staircase.select(dirname(id), 'folder');
          }
          
          delete $('ms-box').dataset.open;
        }
      }
    });
  }
}
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
      if(!confirm('The current file has not been saved. Load anyway?')) {
        if(buffer_id === '') return;

        staircase.removeActive();
        staircase.select(buffer_id, buffer_type, false);
        return;
      }
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
          buffer_id = id;
          buffer_type = 'folder';
          delete $('body').dataset.pending;
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
        let id = e.currentTarget.dataset.id;
        staircase.open(id);
        this.get(id);
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
          staircase.open(this.dirname(id));
          //staircase.select(id, 'file');
        } else {
          this.get(id);
          action = 'folder/read';
          buffer_id = id;
          staircase.open(id);
        }
      });
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

  openParent(el) {
    let closest = el.parentNode.closest('li');

    if(!closest) return;
    
    closest.dataset.scState = 'open';
    this.openParent(closest);
  }
}
class FolderRename {
  constructor(params) {
    this.root = params.root;
    this.options = params.options;
  }

  rename() {
    message.open('loading', {autohide: false});
    this.ajax();
  }

  ajax() {
    let path = this.root + '/api/folder/rename';
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
          staircase.rename(results.old_id, results.new_name, 'folder');
          message.open();
        }
      }
    });
  }
}
/**
 * Countable is a script to allow for live paragraph-, word- and character-
 * counting on an HTML element.
 *
 * @author   Sacha Schmid (<https://github.com/RadLikeWhoa>)
 * @version  3.0.1
 * @license  MIT
 * @see      <http://radlikewhoa.github.io/Countable/>
 */

/**
 * Note: For the purpose of this internal documentation, arguments of the type
 * {Nodes} are to be interpreted as either {NodeList} or {Element}.
 */

;(function (global) {

  /**
   * @private
   *
   * `liveElements` holds all elements that have the live-counting
   * functionality bound to them.
   */

  let liveElements = []
  const each = Array.prototype.forEach

  /**
   * `ucs2decode` function from the punycode.js library.
   *
   * Creates an array containing the decimal code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally, this
   * function will convert a pair of surrogate halves (each of which UCS-2
   * exposes as separate characters) into a single code point, matching
   * UTF-16.
   *
   * @see     <http://goo.gl/8M09r>
   * @see     <http://goo.gl/u4UUC>
   *
   * @param   {String}  string   The Unicode input string (UCS-2).
   *
   * @return  {Array}   The new array of code points.
   */

  function decode (string) {
    const output = []
  	let counter = 0
  	const length = string.length

  	while (counter < length) {
  		const value = string.charCodeAt(counter++)

  		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {

  			// It's a high surrogate, and there is a next character.

  			const extra = string.charCodeAt(counter++)

  			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
  				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000)
  			} else {

  				// It's an unmatched surrogate; only append this code unit, in case the
  				// next code unit is the high surrogate of a surrogate pair.

  				output.push(value)
  				counter--
  			}
  		} else {
  			output.push(value)
  		}
  	}

  	return output
  }

  /**
   * `validateArguments` validates the arguments given to each function call.
   * Errors are logged to the console as warnings, but Countable fails
   * silently.
   *
   * @private
   *
   * @param   {Nodes|String}  targets   A (collection of) element(s) or a single
	 *                                    string to validate.
   *
   * @param   {Function}      callback  The callback function to validate.
   *
   * @return  {Boolean}       Returns whether all arguments are vaild.
   */

  function validateArguments (targets, callback) {
    const nodes = Object.prototype.toString.call(targets)
    const targetsValid = typeof targets === 'string' || ((nodes === '[object NodeList]' || nodes === '[object HTMLCollection]') || targets.nodeType === 1)
    const callbackValid = typeof callback === 'function'

    if (!targetsValid) console.error('Countable: Not a valid target')
    if (!callbackValid) console.error('Countable: Not a valid callback function')

    return targetsValid && callbackValid
  }

  /**
   * `count` trims an element's value, optionally strips HTML tags and counts
   * paragraphs, sentences, words, characters and characters plus spaces.
   *
   * @private
   *
   * @param   {Node|String}  target   The target for the count.
   *
   * @param   {Object}   	   options  The options to use for the counting.
   *
   * @return  {Object}       The object containing the number of paragraphs,
   *                         sentences, words, characters and characters
	 *                         plus spaces.
   */

  function count (target, options) {
    let original = '' + (typeof target === 'string' ? target : ('value' in target ? target.value : target.textContent))
    options = options || {}

    /**
     * The initial implementation to allow for HTML tags stripping was created
     * @craniumslows while the current one was created by @Rob--W.
     *
     * @see <http://goo.gl/Exmlr>
     * @see <http://goo.gl/gFQQh>
     */

    if (options.stripTags) original = original.replace(/<\/?[a-z][^>]*>/gi, '')

    if (options.ignore) {
        each.call(options.ignore, function (i) {
            original = original.replace(i, '')
        })
    }

    const trimmed = original.trim()

    /**
     * Most of the performance improvements are based on the works of @epmatsw.
     *
     * @see <http://goo.gl/SWOLB>
     */

    return {
      paragraphs: trimmed ? (trimmed.match(options.hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0,
      sentences: trimmed ? (trimmed.match(/[.?!…]+./g) || []).length + 1 : 0,
      words: trimmed ? (trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []).length : 0,
      characters: trimmed ? decode(trimmed.replace(/\s/g, '')).length : 0,
      all: decode(original).length
    }
  }

  /**
   * This is the main object that will later be exposed to other scripts. It
   * holds all the public methods that can be used to enable the Countable
   * functionality.
   *
   * Some methods accept an optional options parameter. This includes the
   * following options.
   *
   * {Boolean}      hardReturns  Use two returns to seperate a paragraph
   *                             instead of one. (default: false)
   * {Boolean}      stripTags    Strip HTML tags before counting the values.
   *                             (default: false)
   * {Array<Char>}  ignore       A list of characters that should be removed
   *                             ignored when calculating the counters.
   *                             (default: )
   */

  const Countable = {

    /**
     * The `on` method binds the counting handler to all given elements. The
     * event is either `oninput` or `onkeydown`, based on the capabilities of
     * the browser.
     *
     * @param   {Nodes}     elements   All elements that should receive the
     *                                 Countable functionality.
     *
     * @param   {Function}  callback   The callback to fire whenever the
     *                                 element's value changes. The callback is
     *                                 called with the relevant element bound
     *                                 to `this` and the counted values as the
     *                                 single parameter.
     *
     * @param   {Object}    [options]  An object to modify Countable's
     *                                 behaviour.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    on: function (elements, callback, options) {
      if (!validateArguments(elements, callback)) return

      if (!Array.isArray(elements)) {
          elements = [ elements ]
      }

      each.call(elements, function (e) {
          const handler = function () {
            callback.call(e, count(e, options))
          }

          liveElements.push({ element: e, handler: handler })

          handler()

          e.addEventListener('input', handler)
      })

      return this
    },

    /**
     * The `off` method removes the Countable functionality from all given
     * elements.
     *
     * @param   {Nodes}   elements  All elements whose Countable functionality
     *                              should be unbound.
     *
     * @return  {Object}  Returns the Countable object to allow for chaining.
     */

    off: function (elements) {
      if (!validateArguments(elements, function () {})) return

      if (!Array.isArray(elements)) {
          elements = [ elements ]
      }

      liveElements.filter(function (e) {
          return elements.indexOf(e.element) !== -1
      }).forEach(function (e) {
          e.element.removeEventListener('input', e.handler)
      })

      liveElements = liveElements.filter(function (e) {
          return elements.indexOf(e.element) === -1
      })

      return this
    },

    /**
     * The `count` method works mostly like the `live` method, but no events are
     * bound, the functionality is only executed once.
     *
     * @param   {Nodes|String}  targets   All elements that should be counted.
     *
     * @param   {Function}      callback   The callback to fire whenever the
     *                                     element's value changes. The callback
		 *                                     is called with the relevant element
		 *                                     bound to `this` and the counted values
		 *                                     as the single parameter.
     *
     * @param   {Object}        [options]  An object to modify Countable's
     *                                     behaviour.
     *
     * @return  {Object}    Returns the Countable object to allow for chaining.
     */

    count: function (targets, callback, options) {
      if (!validateArguments(targets, callback)) return

      if (!Array.isArray(targets)) {
          targets = [ targets ]
      }

      each.call(targets, function (e) {
          callback.call(e, count(e, options))
      })

      return this
    },

    /**
     * The `enabled` method checks if the live-counting functionality is bound
     * to an element.
     *
     * @param   {Node}     element  All elements that should be checked for the
     *                              Countable functionality.
     *
     * @return  {Boolean}  A boolean value representing whether Countable
     *                     functionality is bound to all given elements.
     */

    enabled: function (elements) {
      if (elements.length === undefined) {
        elements = [ elements ]
      }

      return liveElements.filter(function (e) {
          return elements.indexOf(e.element) !== -1
      }).length === elements.length
    }

  }

  /**
   * Expose Countable depending on the module system used across the
   * application. (Node / CommonJS, AMD, global)
   */

  if (typeof exports === 'object') {
    module.exports = Countable
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return Countable })
  } else {
    global.Countable = Countable
  }
}(this));
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function(root) {
  'use strict';
  
  /**
   * Block-Level Grammar
   */
  
  var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: noop,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    nptable: noop,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: '^ {0,3}(?:' // optional indentation
      + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
      + '|comment[^\\n]*(\\n+|$)' // (2)
      + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
      + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
      + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
      + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
      + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
      + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
      + ')',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    table: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
    text: /^[^\n]+/
  };
  
  block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block.def = edit(block.def)
    .replace('label', block._label)
    .replace('title', block._title)
    .getRegex();
  
  block.bullet = /(?:[*+-]|\d{1,9}\.)/;
  block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
  block.item = edit(block.item, 'gm')
    .replace(/bull/g, block.bullet)
    .getRegex();
  
  block.list = edit(block.list)
    .replace(/bull/g, block.bullet)
    .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
    .replace('def', '\\n+(?=' + block.def.source + ')')
    .getRegex();
  
  block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
    + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
    + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
    + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
    + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
    + '|track|ul';
  block._comment = /<!--(?!-?>)[\s\S]*?-->/;
  block.html = edit(block.html, 'i')
    .replace('comment', block._comment)
    .replace('tag', block._tag)
    .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
    .getRegex();
  
  block.paragraph = edit(block.paragraph)
    .replace('hr', block.hr)
    .replace('heading', block.heading)
    .replace('lheading', block.lheading)
    .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
    .getRegex();
  
  block.blockquote = edit(block.blockquote)
    .replace('paragraph', block.paragraph)
    .getRegex();
  
  /**
   * Normal Block Grammar
   */
  
  block.normal = merge({}, block);
  
  /**
   * GFM Block Grammar
   */
  
  block.gfm = merge({}, block.normal, {
    fences: /^ {0,3}(`{3,}|~{3,})([^`\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
    paragraph: /^/,
    heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
  });
  
  block.gfm.paragraph = edit(block.paragraph)
    .replace('(?!', '(?!'
      + block.gfm.fences.source.replace('\\1', '\\2') + '|'
      + block.list.source.replace('\\1', '\\3') + '|')
    .getRegex();
  
  /**
   * GFM + Tables Block Grammar
   */
  
  block.tables = merge({}, block.gfm, {
    nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
    table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
  });
  
  /**
   * Pedantic grammar
   */
  
  block.pedantic = merge({}, block.normal, {
    html: edit(
      '^ *(?:comment *(?:\\n|\\s*$)'
      + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
      + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
      .replace('comment', block._comment)
      .replace(/tag/g, '(?!(?:'
        + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
        + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
        + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
      .getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
  });
  
  /**
   * Block Lexer
   */
  
  function Lexer(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || marked.defaults;
    this.rules = block.normal;
  
    if (this.options.pedantic) {
      this.rules = block.pedantic;
    } else if (this.options.gfm) {
      if (this.options.tables) {
        this.rules = block.tables;
      } else {
        this.rules = block.gfm;
      }
    }
  }
  
  /**
   * Expose Block Rules
   */
  
  Lexer.rules = block;
  
  /**
   * Static Lex Method
   */
  
  Lexer.lex = function(src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
  };
  
  /**
   * Preprocessing
   */
  
  Lexer.prototype.lex = function(src) {
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/\u00a0/g, ' ')
      .replace(/\u2424/g, '\n');
  
    return this.token(src, true);
  };
  
  /**
   * Lexing
   */
  
  Lexer.prototype.token = function(src, top) {
    src = src.replace(/^ +$/gm, '');
    var next,
        loose,
        cap,
        bull,
        b,
        item,
        listStart,
        listItems,
        t,
        space,
        i,
        tag,
        l,
        isordered,
        istask,
        ischecked;
  
    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space'
          });
        }
      }
  
      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        cap = cap[0].replace(/^ {4}/gm, '');
        this.tokens.push({
          type: 'code',
          text: !this.options.pedantic
            ? rtrim(cap, '\n')
            : cap
        });
        continue;
      }
  
      // fences (gfm)
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'code',
          lang: cap[2] ? cap[2].trim() : cap[2],
          text: cap[3] || ''
        });
        continue;
      }
  
      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[2]
        });
        continue;
      }
  
      // table no leading pipe (gfm)
      if (top && (cap = this.rules.nptable.exec(src))) {
        item = {
          type: 'table',
          header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
        };
  
        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);
  
          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }
  
          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells(item.cells[i], item.header.length);
          }
  
          this.tokens.push(item);
  
          continue;
        }
      }
  
      // hr
      if (cap = this.rules.hr.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'hr'
        });
        continue;
      }
  
      // blockquote
      if (cap = this.rules.blockquote.exec(src)) {
        src = src.substring(cap[0].length);
  
        this.tokens.push({
          type: 'blockquote_start'
        });
  
        cap = cap[0].replace(/^ *> ?/gm, '');
  
        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        this.token(cap, top);
  
        this.tokens.push({
          type: 'blockquote_end'
        });
  
        continue;
      }
  
      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length);
        bull = cap[2];
        isordered = bull.length > 1;
  
        listStart = {
          type: 'list_start',
          ordered: isordered,
          start: isordered ? +bull : '',
          loose: false
        };
  
        this.tokens.push(listStart);
  
        // Get each top-level item.
        cap = cap[0].match(this.rules.item);
  
        listItems = [];
        next = false;
        l = cap.length;
        i = 0;
  
        for (; i < l; i++) {
          item = cap[i];
  
          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+\.) */, '');
  
          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length;
            item = !this.options.pedantic
              ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
              : item.replace(/^ {1,4}/gm, '');
          }
  
          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (i !== l - 1) {
            b = block.bullet.exec(cap[i + 1])[0];
            if (bull.length > 1 ? b.length === 1
              : (b.length > 1 || (this.options.smartLists && b !== bull))) {
              src = cap.slice(i + 1).join('\n') + src;
              i = l - 1;
            }
          }
  
          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n';
            if (!loose) loose = next;
          }
  
          if (loose) {
            listStart.loose = true;
          }
  
          // Check for task list items
          istask = /^\[[ xX]\] /.test(item);
          ischecked = undefined;
          if (istask) {
            ischecked = item[1] !== ' ';
            item = item.replace(/^\[[ xX]\] +/, '');
          }
  
          t = {
            type: 'list_item_start',
            task: istask,
            checked: ischecked,
            loose: loose
          };
  
          listItems.push(t);
          this.tokens.push(t);
  
          // Recurse.
          this.token(item, false);
  
          this.tokens.push({
            type: 'list_item_end'
          });
        }
  
        if (listStart.loose) {
          l = listItems.length;
          i = 0;
          for (; i < l; i++) {
            listItems[i].loose = true;
          }
        }
  
        this.tokens.push({
          type: 'list_end'
        });
  
        continue;
      }
  
      // html
      if (cap = this.rules.html.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: this.options.sanitize
            ? 'paragraph'
            : 'html',
          pre: !this.options.sanitizer
            && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
          text: cap[0]
        });
        continue;
      }
  
      // def
      if (top && (cap = this.rules.def.exec(src))) {
        src = src.substring(cap[0].length);
        if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
        tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
        if (!this.tokens.links[tag]) {
          this.tokens.links[tag] = {
            href: cap[2],
            title: cap[3]
          };
        }
        continue;
      }
  
      // table (gfm)
      if (top && (cap = this.rules.table.exec(src))) {
        item = {
          type: 'table',
          header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/(?: *\| *)?\n$/, '').split('\n') : []
        };
  
        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);
  
          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }
  
          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells(
              item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
              item.header.length);
          }
  
          this.tokens.push(item);
  
          continue;
        }
      }
  
      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[2] === '=' ? 1 : 2,
          text: cap[1]
        });
        continue;
      }
  
      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n'
            ? cap[1].slice(0, -1)
            : cap[1]
        });
        continue;
      }
  
      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'text',
          text: cap[0]
        });
        continue;
      }
  
      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }
  
    return this.tokens;
  };
  
  /**
   * Inline-Level Grammar
   */
  
  var inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noop,
    tag: '^comment'
      + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
      + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
      + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
      + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
      + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
    link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
    em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noop,
    text: /^(`+|[^`])[\s\S]*?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
  };
  
  // list of punctuation marks from common mark spec
  // without ` and ] to workaround Rule 17 (inline code blocks/links)
  inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
  inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();
  
  inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
  
  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline.autolink = edit(inline.autolink)
    .replace('scheme', inline._scheme)
    .replace('email', inline._email)
    .getRegex();
  
  inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
  
  inline.tag = edit(inline.tag)
    .replace('comment', block._comment)
    .replace('attribute', inline._attribute)
    .getRegex();
  
  inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
  inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/;
  inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
  
  inline.link = edit(inline.link)
    .replace('label', inline._label)
    .replace('href', inline._href)
    .replace('title', inline._title)
    .getRegex();
  
  inline.reflink = edit(inline.reflink)
    .replace('label', inline._label)
    .getRegex();
  
  /**
   * Normal Inline Grammar
   */
  
  inline.normal = merge({}, inline);
  
  /**
   * Pedantic Inline Grammar
   */
  
  inline.pedantic = merge({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
    link: edit(/^!?\[(label)\]\((.*?)\)/)
      .replace('label', inline._label)
      .getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
      .replace('label', inline._label)
      .getRegex()
  });
  
  /**
   * GFM Inline Grammar
   */
  
  inline.gfm = merge({}, inline.normal, {
    escape: edit(inline.escape).replace('])', '~|])').getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^~+(?=\S)([\s\S]*?\S)~+/,
    text: edit(inline.text)
      .replace(']|', '~]|')
      .replace('|$', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|$')
      .getRegex()
  });
  
  inline.gfm.url = edit(inline.gfm.url, 'i')
    .replace('email', inline.gfm._extended_email)
    .getRegex();
  /**
   * GFM + Line Breaks Inline Grammar
   */
  
  inline.breaks = merge({}, inline.gfm, {
    br: edit(inline.br).replace('{2,}', '*').getRegex(),
    text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
  });
  
  /**
   * Inline Lexer & Compiler
   */
  
  function InlineLexer(links, options) {
    this.options = options || marked.defaults;
    this.links = links;
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer();
    this.renderer.options = this.options;
  
    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.');
    }
  
    if (this.options.pedantic) {
      this.rules = inline.pedantic;
    } else if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    }
  }
  
  /**
   * Expose Inline Rules
   */
  
  InlineLexer.rules = inline;
  
  /**
   * Static Lexing/Compiling Method
   */
  
  InlineLexer.output = function(src, links, options) {
    var inline = new InlineLexer(links, options);
    return inline.output(src);
  };
  
  /**
   * Lexing/Compiling
   */
  
  InlineLexer.prototype.output = function(src) {
    var out = '',
        link,
        text,
        href,
        title,
        cap,
        prevCapZero;
  
    while (src) {
      // escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length);
        out += escape(cap[1]);
        continue;
      }
  
      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.inRawBlock = true;
        } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.inRawBlock = false;
        }
  
        src = src.substring(cap[0].length);
        out += this.options.sanitize
          ? this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape(cap[0])
          : cap[0];
        continue;
      }
  
      // link
      if (cap = this.rules.link.exec(src)) {
        src = src.substring(cap[0].length);
        this.inLink = true;
        href = cap[2];
        if (this.options.pedantic) {
          link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
  
          if (link) {
            href = link[1];
            title = link[3];
          } else {
            title = '';
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : '';
        }
        href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
        out += this.outputLink(cap, {
          href: InlineLexer.escapes(href),
          title: InlineLexer.escapes(title)
        });
        this.inLink = false;
        continue;
      }
  
      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src))
          || (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          out += cap[0].charAt(0);
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        out += this.outputLink(cap, link);
        this.inLink = false;
        continue;
      }
  
      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }
  
      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }
  
      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.codespan(escape(cap[2].trim(), true));
        continue;
      }
  
      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.br();
        continue;
      }
  
      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.del(this.output(cap[1]));
        continue;
      }
  
      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape(this.mangle(cap[1]));
          href = 'mailto:' + text;
        } else {
          text = escape(cap[1]);
          href = text;
        }
        out += this.renderer.link(href, null, text);
        continue;
      }
  
      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        if (cap[2] === '@') {
          text = escape(cap[0]);
          href = 'mailto:' + text;
        } else {
          // do extended autolink path validation
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules._backpedal.exec(cap[0])[0];
          } while (prevCapZero !== cap[0]);
          text = escape(cap[0]);
          if (cap[1] === 'www.') {
            href = 'http://' + text;
          } else {
            href = text;
          }
        }
        src = src.substring(cap[0].length);
        out += this.renderer.link(href, null, text);
        continue;
      }
  
      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length);
        if (this.inRawBlock) {
          out += this.renderer.text(cap[0]);
        } else {
          out += this.renderer.text(escape(this.smartypants(cap[0])));
        }
        continue;
      }
  
      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }
  
    return out;
  };
  
  InlineLexer.escapes = function(text) {
    return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
  };
  
  /**
   * Compile Link
   */
  
  InlineLexer.prototype.outputLink = function(cap, link) {
    var href = link.href,
        title = link.title ? escape(link.title) : null;
  
    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, escape(cap[1]));
  };
  
  /**
   * Smartypants Transformations
   */
  
  InlineLexer.prototype.smartypants = function(text) {
    if (!this.options.smartypants) return text;
    return text
      // em-dashes
      .replace(/---/g, '\u2014')
      // en-dashes
      .replace(/--/g, '\u2013')
      // opening singles
      .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
      // closing singles & apostrophes
      .replace(/'/g, '\u2019')
      // opening doubles
      .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
      // closing doubles
      .replace(/"/g, '\u201d')
      // ellipses
      .replace(/\.{3}/g, '\u2026');
  };
  
  /**
   * Mangle Links
   */
  
  InlineLexer.prototype.mangle = function(text) {
    if (!this.options.mangle) return text;
    var out = '',
        l = text.length,
        i = 0,
        ch;
  
    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }
  
    return out;
  };
  
  /**
   * Renderer
   */
  
  function Renderer(options) {
    this.options = options || marked.defaults;
  }
  
  Renderer.prototype.code = function(code, infostring, escaped) {
    var lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }
  
    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>';
    }
  
    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  };
  
  Renderer.prototype.blockquote = function(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  };
  
  Renderer.prototype.html = function(html) {
    return html;
  };
  
  Renderer.prototype.heading = function(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + slugger.slug(raw)
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
    }
    // ignore IDs
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  };
  
  Renderer.prototype.hr = function() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  };
  
  Renderer.prototype.list = function(body, ordered, start) {
    var type = ordered ? 'ol' : 'ul',
        startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  };
  
  Renderer.prototype.listitem = function(text) {
    return '<li>' + text + '</li>\n';
  };
  
  Renderer.prototype.checkbox = function(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  };
  
  Renderer.prototype.paragraph = function(text) {
    return '<p>' + text + '</p>\n';
  };
  
  Renderer.prototype.table = function(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';
  
    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  };
  
  Renderer.prototype.tablerow = function(content) {
    return '<tr>\n' + content + '</tr>\n';
  };
  
  Renderer.prototype.tablecell = function(content, flags) {
    var type = flags.header ? 'th' : 'td';
    var tag = flags.align
      ? '<' + type + ' align="' + flags.align + '">'
      : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  };
  
  // span level renderer
  Renderer.prototype.strong = function(text) {
    return '<strong>' + text + '</strong>';
  };
  
  Renderer.prototype.em = function(text) {
    return '<em>' + text + '</em>';
  };
  
  Renderer.prototype.codespan = function(text) {
    return '<code>' + text + '</code>';
  };
  
  Renderer.prototype.br = function() {
    return this.options.xhtml ? '<br/>' : '<br>';
  };
  
  Renderer.prototype.del = function(text) {
    return '<del>' + text + '</del>';
  };
  
  Renderer.prototype.link = function(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    var out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };
  
  Renderer.prototype.image = function(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
  
    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  };
  
  Renderer.prototype.text = function(text) {
    return text;
  };
  
  /**
   * TextRenderer
   * returns only the textual part of the token
   */
  
  function TextRenderer() {}
  
  // no need for block level renderers
  
  TextRenderer.prototype.strong =
  TextRenderer.prototype.em =
  TextRenderer.prototype.codespan =
  TextRenderer.prototype.del =
  TextRenderer.prototype.text = function (text) {
    return text;
  };
  
  TextRenderer.prototype.link =
  TextRenderer.prototype.image = function(href, title, text) {
    return '' + text;
  };
  
  TextRenderer.prototype.br = function() {
    return '';
  };
  
  /**
   * Parsing & Compiling
   */
  
  function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || marked.defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.slugger = new Slugger();
  }
  
  /**
   * Static Parse Method
   */
  
  Parser.parse = function(src, options) {
    var parser = new Parser(options);
    return parser.parse(src);
  };
  
  /**
   * Parse Loop
   */
  
  Parser.prototype.parse = function(src) {
    this.inline = new InlineLexer(src.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(
      src.links,
      merge({}, this.options, {renderer: new TextRenderer()})
    );
    this.tokens = src.reverse();
  
    var out = '';
    while (this.next()) {
      out += this.tok();
    }
  
    return out;
  };
  
  /**
   * Next Token
   */
  
  Parser.prototype.next = function() {
    return this.token = this.tokens.pop();
  };
  
  /**
   * Preview Next Token
   */
  
  Parser.prototype.peek = function() {
    return this.tokens[this.tokens.length - 1] || 0;
  };
  
  /**
   * Parse Text Tokens
   */
  
  Parser.prototype.parseText = function() {
    var body = this.token.text;
  
    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }
  
    return this.inline.output(body);
  };
  
  /**
   * Parse Current Token
   */
  
  Parser.prototype.tok = function() {
    switch (this.token.type) {
      case 'space': {
        return '';
      }
      case 'hr': {
        return this.renderer.hr();
      }
      case 'heading': {
        return this.renderer.heading(
          this.inline.output(this.token.text),
          this.token.depth,
          unescape(this.inlineText.output(this.token.text)),
          this.slugger);
      }
      case 'code': {
        return this.renderer.code(this.token.text,
          this.token.lang,
          this.token.escaped);
      }
      case 'table': {
        var header = '',
            body = '',
            i,
            row,
            cell,
            j;
  
        // header
        cell = '';
        for (i = 0; i < this.token.header.length; i++) {
          cell += this.renderer.tablecell(
            this.inline.output(this.token.header[i]),
            { header: true, align: this.token.align[i] }
          );
        }
        header += this.renderer.tablerow(cell);
  
        for (i = 0; i < this.token.cells.length; i++) {
          row = this.token.cells[i];
  
          cell = '';
          for (j = 0; j < row.length; j++) {
            cell += this.renderer.tablecell(
              this.inline.output(row[j]),
              { header: false, align: this.token.align[j] }
            );
          }
  
          body += this.renderer.tablerow(cell);
        }
        return this.renderer.table(header, body);
      }
      case 'blockquote_start': {
        body = '';
  
        while (this.next().type !== 'blockquote_end') {
          body += this.tok();
        }
  
        return this.renderer.blockquote(body);
      }
      case 'list_start': {
        body = '';
        var ordered = this.token.ordered,
            start = this.token.start;
  
        while (this.next().type !== 'list_end') {
          body += this.tok();
        }
  
        return this.renderer.list(body, ordered, start);
      }
      case 'list_item_start': {
        body = '';
        var loose = this.token.loose;
  
        if (this.token.task) {
          body += this.renderer.checkbox(this.token.checked);
        }
  
        while (this.next().type !== 'list_item_end') {
          body += !loose && this.token.type === 'text'
            ? this.parseText()
            : this.tok();
        }
  
        return this.renderer.listitem(body);
      }
      case 'html': {
        // TODO parse inline content if parameter markdown=1
        return this.renderer.html(this.token.text);
      }
      case 'paragraph': {
        return this.renderer.paragraph(this.inline.output(this.token.text));
      }
      case 'text': {
        return this.renderer.paragraph(this.parseText());
      }
      default: {
        var errMsg = 'Token with "' + this.token.type + '" type was not found.';
        if (this.options.silent) {
          console.log(errMsg);
        } else {
          throw new Error(errMsg);
        }
      }
    }
  };
  
  /**
   * Slugger generates header id
   */
  
  function Slugger () {
    this.seen = {};
  }
  
  /**
   * Convert string to unique id
   */
  
  Slugger.prototype.slug = function (value) {
    var slug = value
      .toLowerCase()
      .trim()
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-');
  
    if (this.seen.hasOwnProperty(slug)) {
      var originalSlug = slug;
      do {
        this.seen[originalSlug]++;
        slug = originalSlug + '-' + this.seen[originalSlug];
      } while (this.seen.hasOwnProperty(slug));
    }
    this.seen[slug] = 0;
  
    return slug;
  };
  
  /**
   * Helpers
   */
  
  function escape(html, encode) {
    if (encode) {
      if (escape.escapeTest.test(html)) {
        return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
      }
    } else {
      if (escape.escapeTestNoEncode.test(html)) {
        return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
      }
    }
  
    return html;
  }
  
  escape.escapeTest = /[&<>"']/;
  escape.escapeReplace = /[&<>"']/g;
  escape.replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
  escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  
  function unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x'
          ? String.fromCharCode(parseInt(n.substring(2), 16))
          : String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }
  
  function edit(regex, opt) {
    regex = regex.source || regex;
    opt = opt || '';
    return {
      replace: function(name, val) {
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return this;
      },
      getRegex: function() {
        return new RegExp(regex, opt);
      }
    };
  }
  
  function cleanUrl(sanitize, base, href) {
    if (sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return null;
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return null;
      }
    }
    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }
    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return null;
    }
    return href;
  }
  
  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (/^[^:]+:\/*[^/]*$/.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = rtrim(base, '/', true);
      }
    }
    base = baseUrls[' ' + base];
  
    if (href.slice(0, 2) === '//') {
      return base.replace(/:[\s\S]*/, ':') + href;
    } else if (href.charAt(0) === '/') {
      return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
    } else {
      return base + href;
    }
  }
  var baseUrls = {};
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
  
  function noop() {}
  noop.exec = noop;
  
  function merge(obj) {
    var i = 1,
        target,
        key;
  
    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }
  
    return obj;
  }
  
  function splitCells(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    var row = tableRow.replace(/\|/g, function (match, offset, str) {
          var escaped = false,
              curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/),
        i = 0;
  
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) cells.push('');
    }
  
    for (; i < cells.length; i++) {
      // leading or trailing whitespace is ignored per the gfm spec
      cells[i] = cells[i].trim().replace(/\\\|/g, '|');
    }
    return cells;
  }
  
  // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
  // /c*$/ is vulnerable to REDOS.
  // invert: Remove suffix of non-c chars instead. Default falsey.
  function rtrim(str, c, invert) {
    if (str.length === 0) {
      return '';
    }
  
    // Length of suffix matching the invert condition.
    var suffLen = 0;
  
    // Step left until we fail to match the invert condition.
    while (suffLen < str.length) {
      var currChar = str.charAt(str.length - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }
  
    return str.substr(0, str.length - suffLen);
  }
  
  /**
   * Marked
   */
  
  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }
    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type '
        + Object.prototype.toString.call(src) + ', string expected');
    }
  
    if (callback || typeof opt === 'function') {
      if (!callback) {
        callback = opt;
        opt = null;
      }
  
      opt = merge({}, marked.defaults, opt || {});
  
      var highlight = opt.highlight,
          tokens,
          pending,
          i = 0;
  
      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }
  
      pending = tokens.length;
  
      var done = function(err) {
        if (err) {
          opt.highlight = highlight;
          return callback(err);
        }
  
        var out;
  
        try {
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }
  
        opt.highlight = highlight;
  
        return err
          ? callback(err)
          : callback(null, out);
      };
  
      if (!highlight || highlight.length < 3) {
        return done();
      }
  
      delete opt.highlight;
  
      if (!pending) return done();
  
      for (; i < tokens.length; i++) {
        (function(token) {
          if (token.type !== 'code') {
            return --pending || done();
          }
          return highlight(token.text, token.lang, function(err, code) {
            if (err) return done(err);
            if (code == null || code === token.text) {
              return --pending || done();
            }
            token.text = code;
            token.escaped = true;
            --pending || done();
          });
        })(tokens[i]);
      }
  
      return;
    }
    try {
      if (opt) opt = merge({}, marked.defaults, opt);
      return Parser.parse(Lexer.lex(src, opt), opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';
      if ((opt || marked.defaults).silent) {
        return '<p>An error occurred:</p><pre>'
          + escape(e.message + '', true)
          + '</pre>';
      }
      throw e;
    }
  }
  
  /**
   * Options
   */
  
  marked.options =
  marked.setOptions = function(opt) {
    merge(marked.defaults, opt);
    return marked;
  };
  
  marked.getDefaults = function () {
    return {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: new Renderer(),
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tables: true,
      xhtml: false
    };
  };
  
  marked.defaults = marked.getDefaults();
  
  /**
   * Expose
   */
  
  marked.Parser = Parser;
  marked.parser = Parser.parse;
  
  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;
  
  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;
  
  marked.InlineLexer = InlineLexer;
  marked.inlineLexer = InlineLexer.output;
  
  marked.Slugger = Slugger;
  
  marked.parse = marked;
  
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = marked;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return marked; });
  } else {
    root.marked = marked;
  }
  })(this || (typeof window !== 'undefined' ? window : global));
class MessageBase {
  addTemplate() {
    if(!this.$(`#message-template`)) {
      document.body.insertAdjacentHTML('beforeend', this.template());
    }
  }

  init() {
    this.addTemplate();
    this.events();
  }

  actionOpen(type, options) {
    window.clearTimeout(this.timeout);

    type = this.oType(type);
    let text = this.oText(options);
    let autohide = this.oAutohide(options, text, type);
    let reveal = this.oReveal(options, text);
    
    this.o = {
      type: type,
      text: text,
      autohide: autohide,
      reveal: reveal
    };
    
    this.setOpen();
    this.setType();
    this.setText();
    this.setAutohide();
    this.setReveal();
  }

  oType(type) {
    switch(type) {
      case null:
        return 'success';
      case false:
        return 'error';
      case true:
        return 'success';
      default:
        return type;
    }
  }
  
  oText(options) {
    if(typeof options == 'string') {
      if(options === '') return '';
      return options;
    } else {
      if(typeof options.text === 'undefined') return '';
      if(options.text === '') return '';
      return options.text;
    }
  }

  oAutohide(options, text, type) {
    if(this.has(options.autohide)) {
      return options.autohide;
    } else {
      return (text === '' && type === 'success') ? true : false;
    }
  }

  oReveal(options, text) {
    if(this.has(options.reveal)) {
      return options.reveal;
    } else {
      return (text === '') ? false : true;
    }
  }

  setOpen() {
    this.$('ms-box').dataset.open = '';
  }

  setType() {
    this.$('ms-box').dataset.type = this.o.type;
  }

  setText() {
    this.$('ms-box-text').innerHTML = this.o.text;
  }

  setAutohide() {
    if(this.o.autohide) {
      this.$('ms-box').dataset.autohide = '';

      this.timeout = window.setTimeout(() => {
        delete this.$('ms-box').dataset.open;
      }, 1500);
    } else {
      delete this.$('ms-box').dataset.autohide;
    }
  }

  setReveal() {
    if(this.o.reveal) {
      this.$('ms-box').dataset.reveal = '';
    } else {
      delete this.$('ms-box').dataset.reveal;
    }
  }

  $(selector) {
    return document.querySelector(selector);
  }

  events() {
    this.onOpenTextClick();
    this.onCloseMessageClick();
  }

  // EVENTS

  onOpenTextClick() {
    this.$('ms-box-icon').addEventListener('click', (e) => {
      if(this.$('ms-box-text').innerHTML === '') return;
      this.openText();
    });
  }

  onCloseMessageClick() {
    this.$('ms-close-button').addEventListener('click', (e) => {
      this.closeMessage();
    });
  }

  template() {
    return `
      <ms-box>
        <ms-box-icon></ms-box-icon>
          <ms-box-text></ms-box-text>
        <ms-close-button></ms-close-button>
      </ms-box>
    `;
  }

  has(data) {
    return (typeof data !== 'undefined');
  }

  closeMessage() {
    delete this.$('ms-box').dataset.open;
    delete this.$('ms-box').dataset.openText;
  }
}

class message {
  static open(type = null, options = {}) {
    let base = new MessageBase();
    base.actionOpen(type, options);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if(
    typeof document.body.dataset.messageInit !== 'undefined' &&
    document.body.dataset.messageInit === 'false'
  ) return;

  let base = new MessageBase();
  base.init();
});
class staircase {
  static add(base, name, type) {
    let staircase = new StaircaseCore();
    staircase.add(base, name, type);
  }

  static delete(id, type) {
    let staircase = new StaircaseCore();
    staircase.delete(id, type);
  }

  static rename(id, name, type) {
    let staircase = new StaircaseCore();
    staircase.rename(id, name, type);
  }

  static select(id, type, callback = true) {
    let staircase = new StaircaseCore();
    staircase.select(id, type, callback);
  }

  static deselect(id, type) {
    let staircase = new StaircaseCore();
    staircase.deselect(id, type);
  }

  static open(id) {
    let staircase = new StaircaseCore();
    staircase.open(id);
  }

  static close(id) {
    let staircase = new StaircaseCore();
    staircase.close(id);
  }

  static refresh(id) {
    let staircase = new StaircaseCore();
    staircase.refresh(id);
  }

  static removeActive() {
    let staircase = new StaircaseCore();
    staircase.removeActive();
  }
}
class StaircaseCore {
  options() {
    let selector = this.$('body').dataset.staircaseSelector;
    let options = this.$(selector).dataset;

    this.o = {};
    this.o.selector = selector;
    
    for(let attr in options) {
      this.o[attr.substr(9).toLowerCase()] = options[attr];
    }
  }

  init() {
    this.options();
    this.$(this.o.selector).dataset.scName = '/';
    this.ajax('/');
  }

  $(selector, base = null) {
    return (base) ? base.querySelector(selector) : document.querySelector(selector);
  }

  $$(selector, base = null) {
    return (base) ? base.querySelectorAll(selector) : document.querySelectorAll(selector);
  }

  // Ajax
  ajax(id) {
    let rest = id;
    let json = '';
    let data = {};

    id = (typeof id == 'object') ? rest.shift() : id;

    data.id = id;
    json = JSON.stringify(data);
    
    let current = this.item(id, 'folder');

    if(current.dataset.scChildren !== undefined) {
      this.state(current, 'open');
      if(!rest.length) return;
      this.ajax(rest);
      return;
    }

    current.classList.add('sc-loading');

    fetch(this.o.path, this.fetchParams(json))
    .then((response) => { return response.text(); })
    .then((text) => {
      console.log(text);
      current.classList.remove('sc-loading');

      let args = {};
      args.id = id;
      args.element = current;

      if(this.isJson(text)) {
        let ul_element = this.createList(JSON.parse(text), id);
        let current = this.item(id, 'folder');
        
        current.appendChild(ul_element);
        this.children(current);
        this.state(current, 'open');

        this.ajaxClickName(id);
        this.ajaxClickFolder(current);
        this.ajaxClickToggle(current);

        args.success = true;
      } else {
        args.success = false;
      }
      if(args.id == '/') {
        this.callback('load', args);
      } else {
        this.callback('toggle', args);
      }

      if(args.success) {
        if(rest && rest.length && typeof rest == 'object') {
          let next = this.$(this.o.selector + ' [data-sc-name="' + rest[0] + '"]');
          if(!this.hasChildren(next)) {
            this.ajax(rest);
          }
        }
      }
    });
  };

  fetchParams(json) {
    return {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: json
    };
  }

  callback(name, args = {}) {
    if(typeof StaircaseCallbacks === 'function') {
      let callbacks = new StaircaseCallbacks();
      if(typeof callbacks[name] === 'function') {
        callbacks[name](args);
      }
    }
  }

  // Helpers

  state(el, state) {
    el.dataset.scState = state;
  }

  children(el) {
    el.dataset.scChildren = '';
  }

  hasChildren(el) {
    return el.dataset.scChildren !== undefined;
  }

  // Public actions

  refresh(id) {
    this.options();
    let li = this.item(id, 'folder');
    if(!li) return;
    if(li.dataset.scState !== 'open') return;

    li.remove();

    this.add(this.dirname(id), this.basename(id), 'folder');
    this.open(id);
  }

  add(base, name, type) {
    this.options();
    let ul = this.$('[data-sc-name="' + base + '"] > [data-sc-children]');
    if(!ul) return;

    let id = this.trimSlashes(base + '/' + name);
    if(this.item(id, type)) return;

    let li = this.append(base, name, type);
    let el_name = this.$('.sc-name', li);
    let el_icon = this.$('.sc-icon', li);

    ul.appendChild(li);
    this.onClickName(el_name);
    this.onClickFolder(el_icon);

    this.sort(ul);
  }

  delete(id, type) {
    this.options();
    let li = this.item(id, type);
    if(!li) return;
    li.remove();
  }

  rename(id, name, type) {
    this.options();
    let li = this.item(id, type);
    if(!li) return;
    let new_id = id.slice(0, id.lastIndexOf("/")+1) + name;
    this.$('.sc-name', li).innerHTML = name;
    li.dataset.scName = new_id;
    this.sort(li.closest('ul'));
  }

  close(id) {
    let el = this.$('[data-sc-name="' + id + '"]');
    this.state(el, 'close');
    this.callback('toggle', this.setData(el));
  }

  open(id) {
    this.options();
    let ids = id.split('/');
    let append = '';
    let full_ids = [];
    
    for(let part in ids) {
      append += ids[part] + '/';
      full_ids[part] = this.trimSlashes(append);
    }

    this.ajax(full_ids);
  }

  select(id, type, callback) {
    this.options();
    let el = this.item(id, type);
    let data = this.setData(el);
      
    this.removeActive();
    this.setActive(el);

    if(!callback) return;
    this.callback('select', data);
  }

  deselect() {
    this.options();
    this.removeActive();
    this.callback('select');
  }

  basename(path) {
    return path.replace(/.*\//, '');
  }

  dirname(path) {
    return this.trimSlashes(path.match(/.*\//)[0]);
  }

  item(id, type) {
    let selector = '';
    if(id === '/') {
      selector = this.o.selector + '[data-sc-name="/"]';
    } else {
      selector = this.o.selector + ' [data-sc-name="' + id + '"][data-sc-type="' + type + '"]';
    }
    return this.$(selector);
  }

  sort(ul) {
    let lis = this.$$('li', ul);

    [].slice.call(lis).sort(function(a, b) {
        var name1 = a.getAttribute('data-sc-name');
        var name2 = b.getAttribute('data-sc-name');
        var type1 = a.getAttribute('data-sc-type');
        var type2 = b.getAttribute('data-sc-type');

        if(type1 != type2) {
          if(type1 == 'folder') {
            return -1;
          } else {
            return 1;
          }
        }

        if(name1 < name2) {
          return -1;
        } else if(name1 > name2) {
          return 1;
        } else {
          return 0;
        }
    })
    .forEach(function(el) {
      el.parentNode.appendChild(el);
    });
  }

  append(base, name, type) {
    let li = this.createLi(name);
    let id = this.trimSlashes(base + '/' + name);
    li.dataset.scType = type;
    li.dataset.scName = id;
    return li;
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  // Create list
  createList(array, parentName) {
    let ul = document.createElement('ul'); 
    let data = this.toFilesFolders(array);

    this.children(ul);

    data.folders.forEach((item) => {
      let li = this.append(parentName, item, 'folder');
      ul.appendChild(li);
    });

    data.files.forEach((item) => {
      let li = this.append(parentName, item, 'file');
      ul.appendChild(li);
    });

    return ul;
  };

  createLi(item) {
    let li = document.createElement('li');
    let current = document.createElement('div');
    let icon = document.createElement('div');
    let name = document.createElement('div');
    let textnode = document.createTextNode(item);

    icon.classList.add('sc-icon');
    name.classList.add('sc-name');
    current.classList.add('sc-current');

    name.appendChild(textnode);

    current.appendChild(icon);
    current.appendChild(name);

    li.appendChild(current);

    return li;
  };

  // To files and folders
  toFilesFolders(array) {
    let data = [];
    
    data.folders = [];
    data.files = [];

    let i = 0;
    
    array.forEach((item) => {
      if(this.isFolder(item)) {
          data.folders[i] = item.slice(0, -1);
      } else {
          data.files[i] = item
      }
      i++;
    });

    data.folders.sort();
    data.files.sort();

    return data;
  };

  // Is folder
  isFolder(item) {
    return (item[item.length - 1] == '/') ? true: false;
  };

  onClickName(el_name) {
    el_name.addEventListener('click', (e) => {
      let el = e.currentTarget.closest('li');
      let data = this.setData(el);
      
      this.removeActive();
      this.setActive(el);

      this.callback('select', data);
    });
  }

  onClickToggle(el_icon) {
    el_icon.addEventListener('click', (e) => {
      let el = e.currentTarget.closest('li');
      let li = el.closest('li');
      let state = li.dataset.scState;
      let data = this.setData(el);

      if(state == 'open') {
        this.state(li, 'close');
      } else {
        this.state(li, 'open');
      }

      data.state = li.dataset.scState;
      this.callback('toggle', data);
    });
  }

  onClickFolder(el_icon) {
    el_icon.addEventListener('click', (e) => {
      let el = e.currentTarget.closest('[data-sc-name]');

      if(!this.hasChildren(el)) {
        let name = el.dataset.scName;
        let id = this.trimSlashes(name);
        this.ajax(id);
      }
    });
  }

  // Event click name
  ajaxClickName(id) {
    let selector_current = this.o.selector + '[data-sc-name="' + id + '"] > ul > li > .sc-current > .sc-name';
    let selector_children = this.o.selector + ' [data-sc-name="' + id + '"] > ul > li > .sc-current > .sc-name';
    let selector = selector_current + ', ' + selector_children;
    let elements = this.$$(selector);

    elements.forEach((element) => {
     this.onClickName(element);
    });
  };

  // Click toggle loaded folders
  ajaxClickToggle(current) {
    let id = current.dataset.scName;
    let element = this.$(this.o.selector + '[data-sc-name="' + id + '"] > .sc-current > .sc-icon,' + this.o.selector + ' [data-sc-name="' + id + '"] > .sc-current > .sc-icon');

    if(element) {
      this.onClickToggle(element);
    }
  };

  // Event click folder 
  ajaxClickFolder(current) {
    let elements = this.$$('li[data-sc-type="folder"]:not([data-sc-children]) .sc-icon', current);
    
    elements.forEach((element) => {
      this.onClickFolder(element);
    });
  };

  // Trim slashes
  trimSlashes(str) {
    return str.replace(/^\/+|\/+$/g, '');
  };

  // Set info callback data
  setData(el) {
    let data = {};
    data.id = el.dataset.scName;
    data.element = el;
    data.type = el.dataset.scType;

    return data;
  };


  // Remove active
  removeActive() {
    this.options();
    let elements = this.$$(this.o.selector + ' li');

    elements.forEach(function(element) {
        delete element.dataset.scActive;
    });
  };

  // Set active
  setActive(element) {
      element.dataset.scActive = '';
  };
}

document.addEventListener("DOMContentLoaded", () => {
  let staircase = new StaircaseCore();
  staircase.init();
});