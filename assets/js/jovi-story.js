// JOVI — Modo História
//
// Os números das telas são a ordem em que foram extraídas do Figma, não a
// ordem em que uma pessoa realmente usaria o app (a Tela 22 não vem "depois"
// da 21 na vida real — é uma tela de estudo, sem relação). Este arquivo
// define a ORDEM NARRATIVA: um dia inteiro usando o JOVI, do onboarding até
// o Modo Farol resolvendo uma emergência à noite.
//
// Isso alimenta o "trilho" fixo no rodapé de cada tela (ver initStoryRail
// abaixo), com um botão "Continuar" que segue essa ordem — não a ordem dos
// arquivos. As 4 telas legadas que foram substituídas por versões novas no
// Figma (18/19/20/21 — Blindagem e Farol antigos) ficam FORA da história:
// continuam acessíveis pelo catálogo, mas o trilho não aparece nelas, pra
// não competir com a versão atual do mesmo recurso.
(function () {
  "use strict";

  var ATOS = {
    manha: "Manhã · Primeiros passos",
    tarde: "Tarde · Fotos e IA",
    estudo: "Depois da aula · Sessão de estudo",
    noite: "Noite · Segurança"
  };

  var HISTORIA = [
    { file: "tela-01-onboarding.html", titulo: "Conhecendo o JOVI", ato: "manha" },
    { file: "tela-02-nome.html", titulo: "Digite seu nome", ato: "manha" },
    { file: "tela-03-preferencias.html", titulo: "O que você gosta de fotografar", ato: "manha" },
    { file: "tela-04-preferencias-foto.html", titulo: "Preferências de foto", ato: "manha" },
    { file: "tela-05-inicio.html", titulo: "Início", ato: "manha" },
    { file: "tela-07-modo-esporte.html", titulo: "Modo Esporte", ato: "tarde" },
    { file: "tela-06-galeria.html", titulo: "Galeria", ato: "tarde" },
    { file: "tela-12-camera.html", titulo: "Câmera (versão alternativa)", ato: "tarde" },
    { file: "tela-13-camera.html", titulo: "Câmera", ato: "tarde" },
    { file: "tela-35-guia-pose-silhueta.html", titulo: "Guia de pose", ato: "tarde" },
    { file: "tela-15-visualizador-midia.html", titulo: "Visualizador de mídia", ato: "tarde" },
    { file: "tela-10-assistente.html", titulo: "Assistente IA", ato: "tarde" },
    { file: "tela-08-camera-estudo.html", titulo: "Câmera (modo estudo)", ato: "estudo" },
    { file: "tela-14-camera-viewfinder.html", titulo: "Câmera (viewfinder de estudo)", ato: "estudo" },
    { file: "tela-09-selecao-fotos-ia.html", titulo: "Seleção de fotos IA", ato: "estudo" },
    { file: "tela-11-assistente-estudo.html", titulo: "Assistente de Estudo", ato: "estudo" },
    { file: "tela-22-estudo.html", titulo: "Estudo", ato: "estudo" },
    { file: "tela-23-estudo-album.html", titulo: "Álbum de estudo", ato: "estudo" },
    { file: "tela-24-estudo-tentativa.html", titulo: "Tentativa de exercício", ato: "estudo" },
    { file: "tela-25-estudo-roleta.html", titulo: "Jogo de estudo", ato: "estudo" },
    { file: "tela-26-estudo-quiz.html", titulo: "Quiz de limites", ato: "estudo" },
    { file: "tela-27-estudo-caca-erro.html", titulo: "Caça ao erro", ato: "estudo" },
    { file: "tela-28-estudo-completar-expressao.html", titulo: "Complete a expressão", ato: "estudo" },
    { file: "tela-29-estudo-quadro-fragmentado.html", titulo: "Quadro fragmentado", ato: "estudo" },
    { file: "tela-30-estudo-resultado.html", titulo: "Resultado e recompensa", ato: "estudo" },
    { file: "tela-17-ajustes.html", titulo: "Ajustes", ato: "noite" },
    { file: "tela-16-configuracao-traducao.html", titulo: "Configuração de tradução", ato: "noite" },
    { file: "tela-34-modo-blindagem.html", titulo: "Modo Blindagem", ato: "noite" },
    { file: "tela-32-modo-farol-configurar.html", titulo: "Modo Farol (configurar)", ato: "noite" },
    { file: "tela-31-modo-farol-ativacao.html", titulo: "Modo Farol (ativação)", ato: "noite" },
    { file: "tela-33-modo-farol-alerta.html", titulo: "Alerta do Farol", ato: "noite" }
  ];

  function arquivoAtual() {
    var partes = window.location.pathname.split("/");
    return partes[partes.length - 1];
  }

  function initStoryRail() {
    var atual = arquivoAtual();
    var indice = -1;
    for (var i = 0; i < HISTORIA.length; i++) {
      if (HISTORIA[i].file === atual) { indice = i; break; }
    }
    // Telas fora da história (protótipos legados 18/19/20/21) não recebem o
    // trilho — elas continuam acessíveis pelo catálogo, só não competem
    // visualmente com a versão atual do mesmo recurso.
    if (indice < 0) return;

    var passo = HISTORIA[indice];
    var proximo = HISTORIA[indice + 1];
    var progresso = Math.round(((indice + 1) / HISTORIA.length) * 100);

    var rail = document.createElement("div");
    rail.className = "jovi-story-rail";
    rail.innerHTML =
      '<div class="jovi-story-rail__topo">' +
        '<span class="jovi-story-rail__ato">' + ATOS[passo.ato] + '</span>' +
        '<span class="jovi-story-rail__passo">' + (indice + 1) + ' / ' + HISTORIA.length + '</span>' +
      '</div>' +
      '<div class="jovi-story-rail__barra"><span style="width:' + progresso + '%"></span></div>' +
      '<div class="jovi-story-rail__acao"></div>';
    document.body.appendChild(rail);

    // O trilho fica logo ABAIXO do cartão do celular (não colado no rodapé
    // da janela): em janelas mais baixas que 76+800+trilho, isso evita que
    // ele sobreponha o próprio cartão — a página ganha uma barra de rolagem
    // em vez de empilhar os dois por cima um do outro.
    var cartao = document.querySelector(
      ".lacar-phone-frame, .phone-frame, .app-frame, .onboarding-screen, .tela03-screen"
    );
    if (cartao) {
      var rect = cartao.getBoundingClientRect();
      var topoAbsoluto = rect.bottom + window.scrollY + 16;
      rail.style.position = "absolute";
      rail.style.top = topoAbsoluto + "px";
      rail.style.bottom = "auto";
    }

    var acao = rail.querySelector(".jovi-story-rail__acao");

    if (proximo) {
      var legenda = document.createElement("p");
      legenda.className = "jovi-story-rail__proxima";
      legenda.textContent = "A seguir: " + proximo.titulo;
      acao.appendChild(legenda);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "jovi-story-rail__btn";
      btn.innerHTML = "Continuar a história <span>&rarr;</span>";
      btn.addEventListener("click", function () {
        window.location.href = proximo.file;
      });
      acao.appendChild(btn);
    } else {
      var fim = document.createElement("button");
      fim.type = "button";
      fim.className = "jovi-story-rail__btn jovi-story-rail__btn--fim";
      fim.innerHTML = "Fim da história — rever do início &#8635;";
      fim.addEventListener("click", function () {
        window.location.href = HISTORIA[0].file;
      });
      acao.appendChild(fim);
    }
  }

  document.addEventListener("DOMContentLoaded", initStoryRail);
})();
