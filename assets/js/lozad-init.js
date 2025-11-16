(function () {
  window.addEventListener("load", function () {
    if (typeof window.lozad === "undefined") {
      return;
    }

    try {
      var observer = window.lozad(".lozad", {
        rootMargin: window.innerHeight / 2 + "px 0px",
        threshold: 0.01,
        loaded: function (el) {
          el.setAttribute("data-loaded", "true");
        },
      });

      observer.observe();
    } catch (error) {
      console.error("Lozad initialization error:", error);
    }
  });
})();
