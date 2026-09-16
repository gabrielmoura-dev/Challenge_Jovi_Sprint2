// Tela 30 — Resultado e recompensa
// Confete curto (~1.4s) por cima do card de prêmio, no carregamento da
// tela. Puramente decorativo: gerado em JS para não depender de nenhuma
// biblioteca externa, e removido do DOM sozinho ao terminar.
(function () {
  "use strict";

  var CORES = ["#7c5bd9", "#b5a1e8", "#ffce4f", "#3fa88d", "#ffffff"];

  document.addEventListener("DOMContentLoaded", function () {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var card = document.querySelector(".recompensa-card");
    if (!card) return;

    var camada = document.createElement("div");
    camada.className = "confete-camada";
    card.appendChild(camada);

    var total = 26;
    for (var i = 0; i < total; i++) {
      var pedaco = document.createElement("span");
      pedaco.className = "confete-pedaco";
      pedaco.style.left = Math.round(Math.random() * 100) + "%";
      pedaco.style.background = CORES[i % CORES.length];
      pedaco.style.animationDuration = (0.9 + Math.random() * 0.6) + "s";
      pedaco.style.animationDelay = (Math.random() * 0.35) + "s";
      camada.appendChild(pedaco);
    }

    // Some sozinho depois da queda, não fica ocupando o DOM à toa.
    window.setTimeout(function () {
      if (camada.parentNode) camada.parentNode.removeChild(camada);
    }, 2200);
  });
})();
