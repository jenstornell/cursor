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
    
    let current = this.item(id);

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
      current.classList.remove('sc-loading');

      let args = {};
      args.id = id;
      args.element = current;

      if(this.isJson(text)) {
        let ul_element = this.createList(id, JSON.parse(text));
        let current = this.item(id);
        
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
    let li = this.item(id);
    if(!li) return;
    if(li.dataset.scState !== 'open') return;

    li.remove(this.dirname(id));

    this.add(id, 'folder');
    this.open(id);
  }

  add(id, type) {
    this.options();
    let ul = this.$('[data-sc-name="' + this.dirname(id) + '"] > [data-sc-children]');
    
    if(!ul) return;
    if(this.item(id)) return;

    let li = this.append(id, type);

    ul.appendChild(li);
    this.onClickName(this.$('.sc-name', li));
    this.onClickFolder(this.$('.sc-icon', li));

    this.sort(ul);
  }

  delete(id) {
    this.options();
    let li = this.item(id);
    if(!li) return;
    li.remove();
  }

  rename(id, name) {
    this.options();
    let li = this.item(id);
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

  select(id, callback) {
    this.options();
    let el = this.item(id);
    let data = this.setData(el);
      
    this.removeActive();
    this.setActive(el);

    if(!callback) return;
    this.callback('select', data);
  }

  deselect(callback) {
    this.options();
    this.removeActive();

    if(!callback) return;
    this.callback('select');
  }

  basename(path) {
    return path.replace(/.*\//, '');
  }

  dirname(path) {
    let dirname = path.match(/.*\//);
    if(dirname && dirname.length) return this.trimSlashes(dirname[0]);
    return '/';
  }

  item(id) {
    let selector = this.o.selector;
    selector += (id === '/') ? '[data-sc-name="/"]' : ' [data-sc-name="' + id + '"]';
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

  append(id, type) {
    let li = this.createLi(this.basename(id));
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
  createList(base, array) {
    let ul = document.createElement('ul'); 
    let data = this.toFilesFolders(array);

    this.children(ul);

    data.folders.forEach((item) => {
      let join = this.join(base, item);
      let li = this.append(join, 'folder');
      ul.appendChild(li);
    });

    data.files.forEach((item) => {
      let join = this.join(base, item);
      let li = this.append(join, 'file');
      ul.appendChild(li);
    });

    return ul;
  };

  join(folder, file) {
    return this.trimSlashes(folder + '/' + file);
  }

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