// Estudo — roleta (Tela 25) e estados das perguntas (Telas 26, 27, 28)
// Compartilhado pelo pilar Estudo. Não usar nas telas 01-21.
(function () {
  "use strict";

  // Os 6 setores da roleta, na mesma ordem do conic-gradient da Tela 25.
  var TOPICOS = [
    { nome: "Limites", tela: "tela-26-estudo-quiz.html" },
    { nome: "Integrais", tela: "tela-27-estudo-caca-erro.html" },
    { nome: "Teorema", tela: "tela-28-estudo-completar-expressao.html" },
    { nome: "Área", tela: "tela-26-estudo-quiz.html" },
    { nome: "Substituição", tela: "tela-27-estudo-caca-erro.html" },
    { nome: "Partes", tela: "tela-28-estudo-completar-expressao.html" }
  ];

  function initRoleta() {
    var roda = document.querySelector("[data-roleta]");
    var botoes = document.querySelectorAll("[data-roleta-girar]");
    if (!roda || !botoes.length) return;

    // Um único estado de "girando" para os dois botões (centro e rodapé),
    // para não disparar dois sorteios ao mesmo tempo.
    var girando = false;
    var voltas = 0;

    function girar() {
      if (girando) return;
      girando = true;
      botoes.forEach(function (b) { b.disabled = true; });

      var sorteado = Math.floor(Math.random() * TOPICOS.length);
      // Para o ponteiro (fixo no topo) cair no meio do setor sorteado.
      var anguloAlvo = 360 - (sorteado * 60 + 30);
      voltas += 4;
      roda.style.transform = "rotate(" + (voltas * 360 + anguloAlvo) + "deg)";

      // Espera a transição do CSS terminar antes de abrir a pergunta.
      window.setTimeout(function () {
        window.location.href = TOPICOS[sorteado].tela + "?topico=" +
          encodeURIComponent(TOPICOS[sorteado].nome);
      }, 3400);
    }

    botoes.forEach(function (b) {
      b.addEventListener("click", girar);
    });
  }

  // O Figma só desenha o retorno de acerto. Quando a resposta está errada,
  // o mesmo card troca de cor e usa os textos de data-titulo-erro/data-texto-erro.
  function mostrarFeedback(feedback, acertou) {
    if (!feedback) return;
    var titulo = feedback.querySelector(".estudo-feedback-titulo");
    var texto = feedback.querySelector(".estudo-feedback-texto");
    if (!acertou && titulo && feedback.getAttribute("data-titulo-erro")) {
      titulo.textContent = feedback.getAttribute("data-titulo-erro");
    }
    if (!acertou && texto && feedback.getAttribute("data-texto-erro")) {
      texto.textContent = feedback.getAttribute("data-texto-erro");
    }
    feedback.classList.toggle("is-erro", !acertou);
    feedback.hidden = false;
  }

  // Perguntas (26/27/28): o Figma só traz o estado já respondido e correto.
  // Aqui a tela começa sem resposta e revela o feedback depois da escolha,
  // usando as mesmas classes do estado final desenhado.
  function initPergunta() {
    var opcoes = Array.prototype.slice.call(document.querySelectorAll("[data-opcao]"));
    var feedback = document.querySelector("[data-feedback]");
    var proxima = document.querySelector("[data-proxima]");
    if (!opcoes.length) return;

    if (proxima) proxima.disabled = true;

    opcoes.forEach(function (opcao) {
      opcao.addEventListener("click", function () {
        if (opcao.closest(".is-respondida")) return;

        var correta = opcao.getAttribute("data-opcao") === "correta";
        opcao.classList.add(correta ? "is-correta" : "is-incorreta");
        opcao.setAttribute("aria-pressed", "true");

        // Trava a lista e revela o card de feedback correspondente.
        var lista = opcao.parentElement;
        if (lista) lista.classList.add("is-respondida");
        mostrarFeedback(feedback, correta);
        if (proxima) proxima.disabled = false;
      });
    });
  }

  // Tela 28: os tokens preenchem as lacunas na ordem em que são tocados.
  // Só libera "Próxima" quando as duas lacunas batem com o gabarito.
  function initTokens() {
    var lacunas = Array.prototype.slice.call(document.querySelectorAll("[data-lacuna]"));
    var tokens = Array.prototype.slice.call(document.querySelectorAll("[data-token]"));
    var feedback = document.querySelector("[data-feedback]");
    var proxima = document.querySelector("[data-proxima]");
    if (!lacunas.length || !tokens.length) return;

    if (proxima) proxima.disabled = true;
    var posicao = 0;

    tokens.forEach(function (token) {
      token.addEventListener("click", function () {
        if (posicao >= lacunas.length) return;

        var lacuna = lacunas[posicao];
        lacuna.textContent = token.getAttribute("data-token");
        lacuna.classList.add("is-preenchida");
        token.classList.add("is-usado");
        posicao += 1;

        if (posicao < lacunas.length) return;

        // Expressão completa: confere se cada lacuna recebeu o token certo.
        var certa = lacunas.every(function (l) {
          return l.textContent === l.getAttribute("data-lacuna");
        });
        mostrarFeedback(feedback, certa);
        if (proxima) proxima.disabled = false;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initRoleta();
    initPergunta();
    initTokens();
  });
})();
