// JOVI — comportamento compartilhado entre telas
// Tema fica só em assets/js/theme.js (AppTheme). A faixa de modos de captura
// fica em assets/js/camera-modes.js (fonte única de rótulos/ordem/destinos).
// Este arquivo cuida de tiles de preferência (Telas 03/04) e do obturador.
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

  // Flash do obturador — feedback de captura das telas de câmera.
  function initShutter() {
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
    initShutter();
  });
})();
