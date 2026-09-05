/* Tela 3 — Preferências de fotografia: sincroniza o claro/escuro unificado.
   tela-03-dark.css já existe como camada de overrides sobre tela-03.css,
   ativada pela classe .tela03-dark em .tela03-screen — este script só liga
   essa classe ao mesmo botão de tema (assets/js/jovi.js) usado no resto do
   app, e troca os ícones de categoria que têm arte própria por tema. */
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

  // jovi.js já aplicou o tema salvo e religou o clique do botão antes deste
  // script rodar (carregado depois dele) — aqui só falta espelhar o estado
  // inicial e reagir aos cliques seguintes.
  sync();
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) toggle.addEventListener("click", sync);
})();
