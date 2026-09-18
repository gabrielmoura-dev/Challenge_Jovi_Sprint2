// JOVI — faixa de modos de captura da câmera (fonte única de verdade).
//
// Antes, cada tela de câmera escrevia a sua própria faixa de modos à mão:
// três marcações diferentes (.camera__mode, .mode-pill, .camera-mode-pill),
// rótulos que variavam de tela para tela, ordem que mudava, e nenhum dos
// dois scripts navegava — só trocava a classe de ativo. Resultado: dava pra
// clicar em "Esporte" na Tela 12 e nada acontecer.
//
// Agora existe UMA lista, aqui. Cada tela de câmera declara só um marcador:
//
//   <div data-camera-modes="gerais" data-modo-ativo="foto"></div>
//
// e o script rende as pilulas na ordem canônica, marca a ativa e liga a
// navegação. Mudar um rótulo, um ícone, a ordem ou um destino é mudar uma
// linha deste arquivo — todas as telas acompanham.
(function (global) {
  "use strict";

  // Ícones em SVG inline (traço herda a cor do texto via currentColor, então
  // a pilula ativa colore rótulo e ícone juntos). Conjunto Lucide, o mesmo
  // do Figma.
  var ICONES = {
    blindagem: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    estudo: '<path d="M12 7C12 5.939 11.579 4.922 10.828 4.172C10.078 3.421 9.061 3 8 3H2V18H9C9.796 18 10.559 18.316 11.121 18.879C11.684 19.441 12 20.204 12 21M12 7V21M12 7C12 5.939 12.421 4.922 13.172 4.172C13.922 3.421 14.939 3 16 3H22V18H15C14.204 18 13.441 18.316 12.879 18.879C12.316 19.441 12 20.204 12 21M6 8H8M6 12H8M16 8H18M16 12H18"/>',
    esporte: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    foto: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    retrato: '<circle cx="12" cy="12" r="10"/><path d="m14.31 8 5.74 9.94"/><path d="M9.69 8h11.48"/><path d="m7.38 12 5.74-9.94"/><path d="M9.69 16 3.95 6.06"/><path d="M14.31 16H2.83"/><path d="m16.62 12-5.74 9.94"/>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    palestra: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    exercicio: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'
  };

  // Ordem CANÔNICA da câmera. As features novas do projeto (Blindagem e
  // Estudo) vêm primeiro de propósito: são o diferencial do JOVI e ficam
  // visíveis assim que a câmera abre, sem precisar rolar.
  var FAIXAS = {
    gerais: [
      { id: "blindagem", label: "Blindagem", tela: "tela-34-modo-blindagem.html" },
      { id: "estudo",    label: "Estudo",    tela: "tela-08-camera-estudo.html" },
      { id: "esporte",   label: "Esporte",   tela: "tela-07-modo-esporte.html" },
      { id: "foto",      label: "Foto",      tela: "tela-13-camera.html" },
      { id: "retrato",   label: "Retrato",   tela: "tela-35-guia-pose-silhueta.html" },
      { id: "video",     label: "Vídeo",     tela: "tela-12-camera.html" }
    ],
    // Dentro do Modo Estudo os modos gerais não fazem sentido (não se
    // fotografa um jogo de basquete numa aula): a faixa passa a ser o que
    // o Estudo sabe capturar.
    estudo: [
      { id: "chat",      label: "Chat",      tela: "tela-08-camera-estudo.html" },
      { id: "palestra",  label: "Palestra",  tela: "tela-14-camera-viewfinder.html" },
      { id: "exercicio", label: "Exercício", tela: "tela-24-estudo-tentativa.html" }
    ]
  };

  function pilula(modo, ativa) {
    return '<button type="button" class="jovi-mode' + (ativa ? ' is-active' : '') + '"' +
      ' data-modo="' + modo.id + '" data-tela="' + modo.tela + '"' +
      ' aria-pressed="' + (ativa ? 'true' : 'false') + '">' +
      '<svg class="jovi-mode__ico" width="16" height="16" viewBox="0 0 24 24" fill="none"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true">' + (ICONES[modo.id] || '') + '</svg>' +
      '<span class="jovi-mode__label">' + modo.label + '</span>' +
      '</button>';
  }

  function montar(faixa) {
    var nome = faixa.getAttribute("data-camera-modes") || "gerais";
    var ativo = faixa.getAttribute("data-modo-ativo");
    var modos = FAIXAS[nome];
    if (!modos) return;

    faixa.classList.add("jovi-modes");
    faixa.setAttribute("role", "group");
    faixa.setAttribute("aria-label", "Modo de captura");
    faixa.innerHTML = modos.map(function (modo) {
      return pilula(modo, modo.id === ativo);
    }).join("");

    // Mais pilulas do que cabe na moldura — é assim de propósito: a pessoa
    // rola a faixa como num app de câmera de verdade.
    if (global.JoviUI) global.JoviUI.rolagemHorizontal(faixa);

    faixa.addEventListener("click", function (event) {
      var botao = event.target.closest(".jovi-mode");
      if (!botao || faixa.classList.contains("is-arrastando")) return;

      // Já estou nesse modo: não navega (recarregar a mesma tela pareceria
      // um defeito), só reforça o estado.
      if (botao.classList.contains("is-active")) {
        botao.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
        return;
      }

      var destino = botao.getAttribute("data-tela");
      if (global.joviNavegar) global.joviNavegar(destino, event);
      else global.location.href = destino;
    });

    // Se o modo atual estiver fora do campo de visão, traz para dentro com o
    // menor deslocamento possível (scrollIntoView "nearest" não mexe em nada
    // quando a pilula já está visível — então Blindagem/Estudo continuam à
    // vista nas telas em que o modo ativo é um dos primeiros).
    var ativa = faixa.querySelector(".jovi-mode.is-active");
    if (ativa) ativa.scrollIntoView({ inline: "nearest", block: "nearest" });
  }

  function init() {
    document.querySelectorAll("[data-camera-modes]").forEach(montar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.JoviCameraModes = { FAIXAS: FAIXAS };
})(window);
