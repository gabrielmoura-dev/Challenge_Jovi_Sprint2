/* Tela 3 — Preferências de fotografia: sincroniza o claro/escuro unificado.
   tela-03-dark.css já existe como camada de overrides sobre tela-03.css,
   ativada pela classe .tela03-dark em .tela03-screen — este script espelha
   o tema salvo (assets/js/theme.js) nessa classe e troca os ícones de
   categoria que têm arte própria por tema. */
(function () {
  "use strict";

  var screen = document.querySelector(".tela03-screen");
  if (!screen) return;

  var themedIcons = document.querySelectorAll(".tela03-card img[data-src-dark]");

  function sync() {
    var dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
    screen.classList.toggle("tela03-dark", dark);
    themedIcons.forEach(function (img) {
      img.src = dark ? img.getAttribute("data-src-dark") : img.getAttribute("data-src-light");
    });
  }

  sync();
  // O tema só muda pelos Ajustes (tela 17) ou pelo sistema; acompanha o
  // atributo no <html> para refletir qualquer troca sem depender de botão.
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });
})();
