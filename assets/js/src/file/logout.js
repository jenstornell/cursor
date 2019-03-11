class Logout {
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
    $('.filebar .logout').addEventListener('click', (e) => {
      if(!confirm('Are you sure you want to logout?')) return;

      window.location.href = this.root + '/login/?logout';
    });
  }
}