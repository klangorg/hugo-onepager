(function () {
  function initArrowVisibility() {
    var arrow = document.querySelector(".bottom-arrow-overlay");
    var contactSection = document.querySelector("#contact");

    if (!arrow || !contactSection || typeof window.IntersectionObserver !== "function") {
      return;
    }

    var observer = new window.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            arrow.classList.add("visible");
          } else {
            arrow.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: "0px",
      }
    );

    observer.observe(contactSection);
  }

  if (document.readyState === "complete") {
    initArrowVisibility();
  } else {
    window.addEventListener("load", initArrowVisibility);
  }
})();
