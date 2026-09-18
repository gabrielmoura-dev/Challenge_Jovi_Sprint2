// JOVI — utilitários de UI compartilhados por todas as telas.
//
// Carregado no <head> de todas as telas (logo depois de jovi-transicao.js),
// antes de qualquer script de tela. Existe por dois motivos:
//
//   1. JoviUI.frame() — a MOLDURA do celular. O protótipo é fiel a uma
//      interface de câmera de celular: nada pode ser pintado fora do
//      cartão de 360x800. Qualquer coisa criada por JS (toast, bottom
//      sheet, véu) precisa ser pendurada aqui, não no <body>;
//   2. JoviUI.rolagemHorizontal() — a mesma mecânica de arrastar-para-rolar
//      usada pelos chips da Galeria e pela faixa de modos da câmera. Era
//      código duplicado; agora é um só.
(function (global) {
  "use strict";

  // Cada família de telas nomeia a moldura do seu jeito (o protótipo foi
  // montado por várias pessoas). Esta é a lista canônica, do mais específico
  // para o mais genérico.
  var SELETOR_MOLDURA = [
    ".app-frame",
    ".lacar-phone-frame",
    ".phone-frame",
    ".camera-frame",
    ".viewer-frame",
    ".onboarding-screen",
    ".tela03-screen"
  ].join(", ");

  function frame() {
    return document.querySelector(SELETOR_MOLDURA) || document.body;
  }

  /* Arrastar para rolar (mouse ou dedo) + roda do mouse na horizontal, para
     faixas que passam da largura da moldura (chips, modos de captura). A
     barra de rolagem fica oculta pelo CSS; sem isso, no desktop, não haveria
     como ver o resto das opções.

     Enquanto o arrasto está em curso a faixa ganha .is-arrastando: quem
     escuta clique nos itens deve ignorar o clique nesse estado, senão
     arrastar acaba selecionando um item sem querer. */
  function rolagemHorizontal(faixa) {
    if (!faixa) return;

    var arrasto = null;

    faixa.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      arrasto = { x: event.clientX, scroll: faixa.scrollLeft, moveu: false };
    });

    faixa.addEventListener("pointermove", function (event) {
      if (!arrasto) return;
      var dx = event.clientX - arrasto.x;
      if (!arrasto.moveu && Math.abs(dx) < 6) return;
      if (!arrasto.moveu) {
        arrasto.moveu = true;
        faixa.classList.add("is-arrastando");
        faixa.setPointerCapture(event.pointerId);
      }
      faixa.scrollLeft = arrasto.scroll - dx;
    });

    function terminar() {
      if (!arrasto) return;
      var moveu = arrasto.moveu;
      arrasto = null;
      // Solta a classe só depois do click, para um arrasto não selecionar item.
      global.setTimeout(function () { faixa.classList.remove("is-arrastando"); }, moveu ? 50 : 0);
    }

    faixa.addEventListener("pointerup", terminar);
    faixa.addEventListener("pointercancel", terminar);

    faixa.addEventListener("wheel", function (event) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      faixa.scrollLeft += event.deltaY;
      event.preventDefault();
    }, { passive: false });
  }

  global.JoviUI = { frame: frame, rolagemHorizontal: rolagemHorizontal };

  // Alias curto usado por toast.js (mantido para leitura mais natural lá).
  global.JoviFrame = { host: frame };
})(window);
