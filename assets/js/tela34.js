// Tela 34 — Modo Blindagem
// Troca o alvo verificado (boleto / pix / anúncio / QR Code) e mostra um
// veredicto PRÉ-DEFINIDO por alvo, com uma varredura curta antes de revelar.
// Não há detecção real de fraude: é demonstração, igual ao que a Tela 18 já
// faz em assets/js/tela22.js.
(function () {
  "use strict";

  // Só o boleto tem cena desenhada no Figma (nó 553:1848). Os outros três
  // alvos reaproveitam as cenas que já existiam no projeto para a Tela 18.
  var ALVOS = {
    boleto: {
      cena: "../assets/img/blindagem-boleto-cena.png",
      risco: false,
      titulo: "Nenhum risco encontrado",
      sub: "Sem sinais de golpe neste boleto. Confira o valor antes de pagar."
    },
    pix: {
      cena: "../assets/img/blindagem-pix.svg",
      risco: false,
      titulo: "Chave Pix confere",
      sub: "O nome do recebedor bate com o do documento. Confirme o valor antes de enviar."
    },
    anuncio: {
      cena: "../assets/img/blindagem-anuncio.svg",
      risco: true,
      titulo: "Sinais de golpe neste anúncio",
      sub: "Preço muito abaixo do mercado e pagamento só por transferência. Não pague adiantado."
    },
    qrcode: {
      cena: "../assets/img/blindagem-qrcode.svg",
      risco: true,
      titulo: "QR Code suspeito",
      sub: "O destino do pagamento não corresponde ao estabelecimento. Peça outro código."
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var veredito = document.querySelector("[data-veredito]");
    var titulo = document.querySelector("[data-veredito-titulo]");
    var sub = document.querySelector("[data-veredito-sub]");
    var abas = Array.prototype.slice.call(document.querySelectorAll("[data-alvo]"));
    var cena = document.querySelector("[data-blindagem-cena]");
    var escanear = document.querySelector("[data-blindagem-escanear]");
    if (!veredito || !abas.length) return;

    var alvoAtual = "boleto";

    function aplicar(chave) {
      var dados = ALVOS[chave];
      if (!dados) return;
      alvoAtual = chave;

      if (cena) cena.setAttribute("src", dados.cena);

      // Varredura curta antes de revelar o veredicto.
      veredito.classList.add("is-escaneando");
      window.setTimeout(function () {
        if (titulo) titulo.textContent = dados.titulo;
        if (sub) sub.textContent = dados.sub;
        veredito.classList.toggle("is-risco", dados.risco);
        veredito.classList.remove("is-escaneando");
      }, 700);
    }

    abas.forEach(function (aba) {
      aba.addEventListener("click", function () {
        abas.forEach(function (a) {
          a.classList.remove("is-ativa");
          a.setAttribute("aria-selected", "false");
        });
        aba.classList.add("is-ativa");
        aba.setAttribute("aria-selected", "true");
        aplicar(aba.getAttribute("data-alvo"));
      });
    });

    if (escanear) {
      escanear.addEventListener("click", function () {
        aplicar(alvoAtual);
      });
    }
  });
})();
