class Staircase {
  constructor(options) {
    this.o = Object.assign({}, this.defaults(), options);
  }

  load() {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector(this.o.selector).dataset.scName = '/';
        this.ajax('/');
    });
  }

  // Default options
  defaults() {
    return {
      ajaxPath: 'ajax.php',
      selector: 'stair-case',
      fetchParams: {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        }
      }
    };
  };

  // $ like jQuery
  $(selector) {
      let all = document.querySelectorAll(selector);
      if(all.length == 0) return null;
      if(all.length == 1) return all[0];
      return all;
  }

  // Ajax
  ajax(id) {
    let data = {};
    let params = this.o.fetchParams;

    data.id = id;

    let json = JSON.stringify(data);
    let current = this.$(this.o.selector + '[data-sc-name="' + id + '"], ' + this.o.selector + ' [data-sc-name="' + id + '"]');
    current.classList.add('sc-loading');

    params.body = json;

    fetch(this.o.ajaxPath, params)
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      current.classList.remove('sc-loading');

      let args = {};
      args.id = id;
      args.element = current;

      if(this.isJson(text)) {
        let array = JSON.parse(text);
        let element = this.createList(array, id);
        let current = this.$(this.o.selector + '[data-sc-name="' + id + '"],' + this.o.selector + ' [data-sc-name="' + id + '"]');
        
        current.appendChild(element);
        current.dataset.scChildren = '';
        current.dataset.scState = 'open';

        this.eventClickName(id);
        this.eventClickFolder(current);
        this.eventClickToggle(current);

        args.success = true;
      } else {
        args.success = false;
      }

      if(typeof this.o.callbacks.load === 'function') {
        this.o.callbacks.select(args);
      }
    });
  };

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

    ul.dataset.scChildren = '';

    data.folders.forEach((item) => {
        let li = this.createLi(item);
        let id = this.trimSlashes(parentName + '/' + item);
        
        li.dataset.scType = 'folder';
        li.dataset.scName = id;

        ul.appendChild(li);
    });

    data.files.forEach((item) => {
        let li = this.createLi(item);
        let id = this.trimSlashes(parentName + '/' + item);
        
        li.dataset.scType = 'file';
        li.dataset.scName = id;

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

  // Event click name
  eventClickName(id) {
    let selector_current = this.o.selector + '[data-sc-name="' + id + '"] > ul > li > .sc-current > .sc-name';
    let selector_children = this.o.selector + ' [data-sc-name="' + id + '"] > ul > li > .sc-current > .sc-name';
    let selector = selector_current + ', ' + selector_children;
    let elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      element.addEventListener('click', (e) => {
        let el = e.currentTarget.closest('li');
        let data = this.setData(el);
        
        this.removeActive();
        this.setActive(el);

        if(typeof this.o.callbacks.select === 'function') {
            this.o.callbacks.select(data);
        }
      });
    });
  };

  // Click toggle loaded folders
  eventClickToggle(current) {
    let id = current.dataset.scName;
    let element = this.$(this.o.selector + '[data-sc-name="' + id + '"] > .sc-current > .sc-icon,' + this.o.selector + ' [data-sc-name="' + id + '"] > .sc-current > .sc-icon');

    if(element) {
      element.addEventListener('click', (e) => {
        let el = e.currentTarget.closest('li');
        let data = this.setData(el);

        if(current.dataset.scState == 'open') {
            current.dataset.scState = 'close';
        } else {
            current.dataset.scState = 'open';
        }

        data.state = current.dataset.scState;

        if(typeof this.o.callbacks.toggle === 'function') {
            this.o.callbacks.toggle(data);
        }
      });
    }
  };

  // Event click folder 
  eventClickFolder(current) {
    let elements = current.querySelectorAll('li[data-sc-type="folder"]:not([data-sc-children]) .sc-icon');
    
    elements.forEach((element) => {
      element.addEventListener('click', (e) => {
        let el = e.currentTarget.closest('[data-sc-name]');

        if(el.dataset.scChildren === undefined) {
            let name = el.dataset.scName;
            let id = this.trimSlashes(name);
            this.ajax(id);
        }
      }, true);

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
    let elements = this.$(this.o.selector + ' li');

    elements.forEach(function(element) {
        delete element.dataset.scActive;
    });
  };

  // Set active
  setActive(element) {
      element.dataset.scActive = '';
  };
}

function staircase(args) {
  var Instance = new Staircase(args);
  Instance.load(args);
}