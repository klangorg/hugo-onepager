(function () {
  var livechatUrl = "https://rocket.xana.space/livechat";
  var livechatScript = "https://rocket.xana.space/livechat/rocketchat-livechat.min.js?_=201903270000";

  function queueTheme() {
    if (typeof window.RocketChat !== "function") {
      return;
    }

    window.RocketChat(function () {
      this.setTheme({
        color: "#2bb673",
        fontColor: "#000",
        iconColor: "#ffffff",
      });
    });
  }

  function bootstrapRocketChat() {
    if (window.RocketChat && window.RocketChat._initialized) {
      queueTheme();
      return;
    }

    (function (w, d, s, u, src) {
      w.RocketChat = function (c) {
        w.RocketChat._.push(c);
      };
      w.RocketChat._ = [];
      w.RocketChat.url = u;

      var h = d.getElementsByTagName(s)[0];
      var j = d.createElement(s);
      j.async = true;
      j.src = src;
      h.parentNode.insertBefore(j, h);
    })(window, document, "script", livechatUrl, livechatScript);

    queueTheme();
  }

  if (document.readyState === "complete") {
    bootstrapRocketChat();
  } else {
    window.addEventListener("load", bootstrapRocketChat);
  }
})();
