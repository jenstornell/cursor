class Fullscreen {
  init() {
    //this.events();
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