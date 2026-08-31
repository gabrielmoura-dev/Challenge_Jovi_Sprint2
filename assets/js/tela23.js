// Tela 23 — Modo Farol · Configurar
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Switches (mestre, contatos, itens enviados junto com o alerta)
    document.querySelectorAll(".farol-switch").forEach(function (sw) {
      sw.addEventListener("click", function () {
        sw.classList.toggle("is-on");
      });
    });

    // Seleção de gesto — só um ativo por vez, mesma lógica de radiogroup
    // usada em initGalleryFilters/initCameraModes (jovi.js), aplicada aqui
    // porque é específica do Farol.
    var options = Array.prototype.slice.call(document.querySelectorAll(".gesture-option"));
    var railLabel = document.getElementById("gestureRailLabel");

    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        options.forEach(function (o) {
          o.classList.remove("is-active");
          o.setAttribute("aria-pressed", "false");
        });
        opt.classList.add("is-active");
        opt.setAttribute("aria-pressed", "true");

        if (railLabel) {
          var title = opt.querySelector(".gesture-option__title");
          railLabel.textContent = title ? title.textContent : "";
        }
      });
    });

    // Testar gesto — pulso visual no trilho, sem navegar
    var rail = document.getElementById("gestureRail");
    var testBtn = document.getElementById("testGesture");
    if (testBtn && rail) {
      testBtn.addEventListener("click", function () {
        rail.classList.remove("is-firing");
        void rail.offsetWidth; // força reflow para poder repetir a animação
        rail.classList.add("is-firing");
      });
    }
  });
})();
