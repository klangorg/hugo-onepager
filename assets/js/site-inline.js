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

    var themeApplied = false;
    var maxRetries = 5;
    var retryCount = 0;
    var retryDelay = 200;

    var w = window;
    var d = document;
    var firstScript = d.getElementsByTagName('script')[0];
    var rocketScript = d.createElement('script');

    w.RocketChat = function (callback) {
      (w.RocketChat._ = w.RocketChat._ || []).push(callback);
    };
    w.RocketChat._ = w.RocketChat._ || [];
    w.RocketChat.url = 'https://rocket.xana.space/livechat';

    function applyTheme() {
      w.RocketChat(function () {
        try {
          this.setTheme({
            color: '#2bb673',
            fontColor: '#000',
            iconColor: '#ffffff',
            background: 'transparent'
          });
          themeApplied = true;
          console.log('[RocketChat] Theme applied successfully');
        } catch (e) {
          console.error('[RocketChat] Theme application error:', e);
        }
      });
    }

    function validateTheme() {
      retryCount++;

      if (typeof w.RocketChat !== 'function' || !w.RocketChat.livechat) {
        if (retryCount < maxRetries) {
          console.log('[RocketChat] Waiting for API... retry', retryCount);
          setTimeout(validateTheme, retryDelay);
          return;
        } else {
          console.warn('[RocketChat] API not ready after retries, marking as initialized');
          wrapper.classList.add('rocketchat-initialized');
          return;
        }
      }

      if (!themeApplied && retryCount <= maxRetries) {
        console.log('[RocketChat] Reapplying theme, retry', retryCount);
        applyTheme();
        setTimeout(validateTheme, retryDelay);
        return;
      }

      wrapper.classList.add('rocketchat-initialized');
      console.log('[RocketChat] Initialization complete');
    }

    rocketScript.async = true;
    rocketScript.src = 'https://rocket.xana.space/livechat/rocketchat-livechat.min.js?_=201903270000';

    rocketScript.onload = function() {
      console.log('[RocketChat] External script loaded');
      setTimeout(function() {
        applyTheme();
        setTimeout(validateTheme, 300);
      }, 100);
    };

    rocketScript.onerror = function() {
      console.error('[RocketChat] Failed to load external script');
      wrapper.classList.add('rocketchat-initialized');
    };

    firstScript.parentNode.insertBefore(rocketScript, firstScript);
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

  // Wait for complete load (DOM + CSS + images)
  if (document.readyState === 'complete') {
    setTimeout(initRocketChat, 50);
  } else {
    window.addEventListener('load', function() {
      setTimeout(initRocketChat, 50);
    });
  }
})();
