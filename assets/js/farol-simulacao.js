// Modo Farol — telas 31, 32 e 33 (versões novas vindas do Figma)
// Tudo aqui é simulação de demonstração: nenhum alerta é enviado, nenhuma
// ligação é feita e nenhuma câmera/áudio é transmitido de verdade.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Switches (mestre e contatos) — mesmo comportamento da Tela 19.
    document.querySelectorAll(".farol-switch").forEach(function (sw) {
      sw.addEventListener("click", function () {
        var ligado = sw.classList.toggle("is-on");
        sw.setAttribute("aria-checked", ligado ? "true" : "false");
      });
    });

    // Gestos — só um ativo por vez.
    var gestos = Array.prototype.slice.call(document.querySelectorAll("[data-gesto]"));
    gestos.forEach(function (gesto) {
      gesto.addEventListener("click", function () {
        gestos.forEach(function (g) {
          g.classList.remove("is-ativo");
          g.setAttribute("aria-pressed", "false");
        });
        gesto.classList.add("is-ativo");
        gesto.setAttribute("aria-pressed", "true");
      });
    });

    // Pulso visual antes de navegar, na simulação do gesto (Tela 31). O pulso
    // (0.4s em tela-31.css) precisa terminar antes da troca de tela.
    var simular = document.querySelector("[data-simular-gesto]");
    if (simular) {
      var disparado = false;
      simular.addEventListener("click", function () {
        if (disparado) return;
        disparado = true;
        simular.classList.remove("is-firing");
        void simular.offsetWidth; // força reflow para poder repetir a animação
        simular.classList.add("is-firing");
        var destino = simular.getAttribute("data-destino");
        if (destino) {
          window.setTimeout(function () { window.joviNavegar(destino); }, 700);
        }
      });
    }

    // Cronômetro da transmissão simulada (Tela 33).
    var cronometro = document.querySelector("[data-cronometro]");
    if (cronometro) {
      var segundos = 12;
      window.setInterval(function () {
        segundos += 1;
        var m = String(Math.floor(segundos / 60)).padStart(2, "0");
        var s = String(segundos % 60).padStart(2, "0");
        cronometro.textContent = m + ":" + s;
      }, 1000);
    }
  });
})();
