// Tela 29 — Quadro fragmentado
// Posiciona os recortes nos slots na ordem em que são tocados e só libera a
// verificação com os três posicionados. A ordem correta NÃO está definida no
// Figma (não há tela de acerto/erro entre as frames 22-34), então a
// verificação aqui é uma confirmação de demonstração, não uma correção real.
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var recortes = Array.prototype.slice.call(document.querySelectorAll("[data-recorte]"));
    var slots = Array.prototype.slice.call(document.querySelectorAll("[data-slot]"));
    var contador = document.querySelector("[data-contador]");
    var verificar = document.querySelector("[data-verificar]");
    if (!recortes.length || !slots.length) return;

    var posicionados = 0;

    recortes.forEach(function (recorte) {
      recorte.addEventListener("click", function () {
        if (posicionados >= slots.length) return;

        var slot = slots[posicionados];
        var imagem = recorte.querySelector("img");
        slot.textContent = "";
        if (imagem) {
          var copia = document.createElement("img");
          copia.src = imagem.getAttribute("src");
          copia.alt = "";
          slot.appendChild(copia);
        }
        slot.classList.add("is-preenchido");
        recorte.classList.add("is-usado");
        posicionados += 1;

        if (contador) contador.textContent = String(posicionados);
        if (verificar) verificar.disabled = posicionados < slots.length;
      });
    });

    if (verificar) {
      verificar.addEventListener("click", function () {
        if (window.JoviToast) {
          window.JoviToast.show("Investigação 2 de 2 em breve");
        }
      });
    }
  });
})();
