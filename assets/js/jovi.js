// JOVI — comportamento compartilhado entre telas
// Tema fica só em assets/js/theme.js (AppTheme). Este arquivo cuida de
// tiles de preferência (Telas 03/04) e modos de captura das câmeras.
// O filtro de categoria da Galeria (Tela 06) tem lógica própria demais
// (troca de painel, fallback de "Vídeos") — fica em assets/js/tela7.js.
(function () {
  "use strict";

  // Tela 4 — seleção múltipla de preferências (toggle visual)
  function initPrefTiles() {
    document.querySelectorAll("[data-pref-tile]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.classList.toggle("selected");
        btn.setAttribute(
          "aria-pressed",
          btn.classList.contains("selected") ? "true" : "false"
        );
      });
    });
  }

  // Tela 16 — seleção de modo de captura (Esporte / Foto / Retrato / Noturno)
  function initCameraModes() {
    var modes = document.querySelectorAll("[data-camera-mode]");
    modes.forEach(function (mode) {
      mode.addEventListener("click", function () {
        modes.forEach(function (m) { m.classList.remove("active"); });
        mode.classList.add("active");
      });
    });

    var shutter = document.querySelector("[data-camera-shutter]");
    if (shutter) {
      shutter.addEventListener("click", function () {
        shutter.classList.add("shutter-flash");
        setTimeout(function () {
          shutter.classList.remove("shutter-flash");
        }, 150);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPrefTiles();
    initCameraModes();
  });
})();
