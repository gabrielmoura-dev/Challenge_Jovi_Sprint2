/* Tela 15 — Câmera: troca do modo de captura. */
(function () {
  "use strict";

  var modes = document.querySelector("[data-modes]");
  if (!modes) return;

  modes.addEventListener("click", function (event) {
    var mode = event.target.closest(".camera__mode");
    if (!mode) return;

    modes.querySelectorAll(".camera__mode").forEach(function (item) {
      var active = item === mode;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    mode.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  });
})();
