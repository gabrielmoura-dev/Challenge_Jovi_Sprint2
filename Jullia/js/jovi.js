// JOVI — comportamento compartilhado entre telas
(function () {
  "use strict";

  var STORAGE_KEY = "jovi-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
    }
  }

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage pode estar bloqueado (modo privado); segue com padrão
    }
    applyTheme(saved === "dark" ? "dark" : "light");

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-bs-theme");
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
      });
    }
  }

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

  // Tela 6 — filtro de categoria (Tudo / Vídeos / Esporte / Estudos)
  function initGalleryFilters() {
    var pills = document.querySelectorAll("[data-gallery-filter]");
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
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
    initTheme();
    initPrefTiles();
    initGalleryFilters();
    initCameraModes();
  });
})();
