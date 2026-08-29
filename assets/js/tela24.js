// Tela 24 — Modo Farol · Ativação
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("simulateBtn");
    var indicator = document.getElementById("indicator");
    var topwash = document.getElementById("topwash");
    var hint = document.getElementById("lockHint");
    var next = document.getElementById("lockNext");
    if (!btn || !indicator || !topwash || !hint) return;

    var activated = false;
    var taps = 0;
    var tapTimer = null;

    function activate() {
      activated = true;
      btn.disabled = true;
      btn.textContent = "Farol ativado";

      topwash.classList.add("is-flash");
      indicator.classList.add("is-on");
      hint.classList.add("is-active");
      hint.innerHTML =
        "<b>A tela continua exatamente igual.</b>" +
        "Só esse ponto discreto, do tamanho de um pixel, começou a piscar.";

      if (next) next.classList.add("is-ready");
    }

    btn.addEventListener("click", function () {
      if (activated) return;

      clearTimeout(tapTimer);
      taps++;

      if (taps >= 3) {
        activate();
        return;
      }

      btn.textContent = "Simular 3× volume (" + taps + "/3)";
      tapTimer = setTimeout(function () {
        taps = 0;
        btn.textContent = "Simular 3× volume";
      }, 1400);
    });
  });
})();
