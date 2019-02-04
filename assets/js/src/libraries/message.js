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