(function () {
  'use strict';

  function initLozadObserver() {
    if (typeof window.lozad === 'undefined') return;
    try {
      var observer = window.lozad('.lozad', {
        rootMargin: window.innerHeight / 2 + 'px 0px',
        threshold: 0.01,
        loaded: function (el) {
          el.setAttribute('data-loaded', 'true');
        }
      });
      observer.observe();
    } catch (error) {
      console.error('Lozad initialization error:', error);
    }
  }

  function initRocketChat() {
    var wrapper = document.querySelector('.rocketchat-wrapper');
    if (!wrapper) return;

    var w = window;
    var d = document;
    var firstScript = d.getElementsByTagName('script')[0];
    var rocketScript = d.createElement('script');

    w.RocketChat = function (callback) {
      (w.RocketChat._ = w.RocketChat._ || []).push(callback);
    };
    w.RocketChat._ = w.RocketChat._ || [];
    w.RocketChat.url = 'https://rocket.xana.space/livechat';

    rocketScript.async = true;
    rocketScript.src = 'https://rocket.xana.space/livechat/rocketchat-livechat.min.js?_=201903270000';
    firstScript.parentNode.insertBefore(rocketScript, firstScript);

    w.RocketChat(function () {
      this.setTheme({
        color: '#2bb673',
        fontColor: '#000',
        iconColor: '#ffffff',
        background: 'transparent'
      });
    });
  }

  function initArrowObserver() {
    var arrow = document.querySelector('.bottom-arrow-overlay');
    var contactSection = document.querySelector('#contact');
    if (!arrow || !contactSection) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          arrow.classList.add('visible');
        } else {
          arrow.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: '0px'
    });

    observer.observe(contactSection);
  }

  window.addEventListener('load', initLozadObserver);
  window.addEventListener('load', initArrowObserver);

  window.si = window.si || function () {
    (window.siq = window.siq || []).push(arguments);
  };

  initRocketChat();
})();
