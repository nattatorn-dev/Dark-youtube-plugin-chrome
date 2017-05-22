class StyleSwitcher {
  constructor() {
    this.head = document.getElementsByTagName('head')[0];
    this.link = document.createElement('link');

    this.link.id = 'dark-youtube-styles';
    this.link.rel = 'stylesheet';
    this.link.type = 'text/css';
    this.link.href = this.styleURL();
    this.link.media = 'screen';

    this.active = false;
  }

  activate() {
    if (this.active) {
      return;
    }

    this.active = true;
    this.head.appendChild(this.link);
  }

  deactivate() {
    if (!this.active) {
      return;
    }

    this.active = false;
    this.head.removeChild(this.link);
  }

  switch(active) {
    if (active) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  styleURL() {
    return chrome.extension.getURL('styles.css');
  }
}

const port = chrome.runtime.connect({name: 'dark-youtube'});

document.cookie = 'VISITOR_INFO1_LIVE=Qa1hUZu3gtk';
const interval = setInterval(() => {
  if (document.querySelector('body > *')) {
    try {
      const styleSwitcher = new StyleSwitcher();

      port.onMessage.addListener(status => {
        if (typeof status.active !== 'undefined') {
          styleSwitcher.switch(status.active);
        }
      });

      port.postMessage({method: 'notifyActiveStatus', args: {}});
    } finally {
      clearInterval(interval);
    }
  }
}, 100);
