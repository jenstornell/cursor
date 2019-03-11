class Wall {
  init() {
    this.events();
  }

  events() {
    this.onSubmitForm();
  }

  onSubmitForm() {
    document.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.ajax(e.target.username.value, e.target.password.value);
    });
  }

  ajax(username, password) {
    let data = {};
    let path = root_url + '?login';

    data.username = username;
    data.password = password;

    fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
    })
    .then((response) => {
        return response.text();
    })
    .then((text) => {
      document.querySelector('.message.error').classList.remove('show');
      document.querySelector('.message.loggedin').classList.remove('show');

      if(!this.isJson(text)) {
        document.querySelector('.message.error').classList.add('show');
        document.querySelector('.message.error span').innerHTML = texts['login.error'];
      } else {
        let results = JSON.parse(text);
        if(!results.success) {
          document.querySelector('.message.error').classList.add('show');
          document.querySelector('.message.error span').innerHTML = texts['login.unauthorized'];
        } else {
          window.location.replace(redirect_url);
        }
      }
    });
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  let wall = new Wall();
  wall.init();
});