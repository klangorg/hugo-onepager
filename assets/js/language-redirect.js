(function () {
  'use strict';

  var STORAGE_KEY = 'preferredLanguage';
  var LANG = { GERMAN: 'de', ENGLISH: 'en' };

  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      /* ignore */
    }
  }

  function detectBrowserLanguage() {
    try {
      var lang = navigator.language || navigator.userLanguage;
      if (lang) {
        lang = lang.toLowerCase();
        if (lang.indexOf('de') === 0) return LANG.GERMAN;
        if (lang.indexOf('en') === 0) return LANG.ENGLISH;
      }
      if (navigator.languages && navigator.languages.length > 0) {
        for (var i = 0; i < navigator.languages.length; i += 1) {
          var browserLang = navigator.languages[i].toLowerCase();
          if (browserLang.indexOf('de') === 0) return LANG.GERMAN;
          if (browserLang.indexOf('en') === 0) return LANG.ENGLISH;
        }
      }
    } catch (error) {
      /* ignore */
    }
    return LANG.ENGLISH;
  }

  function getCurrentLanguage() {
    var path = window.location.pathname;
    return (path.indexOf('/en/') === 0 || path === '/en') ? LANG.ENGLISH : LANG.GERMAN;
  }

  function redirectToLanguage(targetLang) {
    var currentLang = getCurrentLanguage();
    if (currentLang === targetLang) return;

    var currentPath = window.location.pathname;
    var hash = window.location.hash || '';
    var newPath;

    if (targetLang === LANG.ENGLISH) {
      newPath = (currentPath === '/' || currentPath === '') ? '/en/' : '/en' + currentPath;
    } else {
      if (currentPath === '/en' || currentPath === '/en/') {
        newPath = '/';
      } else {
        newPath = currentPath.replace(/^\/en/, '');
      }
    }

    window.location.href = newPath + hash;
  }

  var storedLang = getStoredLanguage();
  if (storedLang) {
    redirectToLanguage(storedLang);
    return;
  }

  var browserLang = detectBrowserLanguage();
  storeLanguage(browserLang);
  redirectToLanguage(browserLang);
})();
