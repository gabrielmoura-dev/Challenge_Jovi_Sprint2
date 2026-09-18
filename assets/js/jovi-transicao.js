// JOVI — navegação entre telas com a resposta de um celular de verdade.
//
// O protótipo é multi-página (cada tela é um arquivo). Trocar de arquivo
// direto com window.location dá um "piscar" seco, coisa que nenhum app de
// celular faz. Este arquivo centraliza a navegação em window.joviNavegar():
//
//   1. o feedback de pressão (.jovi-pressionado) entra no TOQUE
//      (pointerdown), como num telefone — não no clique, que só acontece
//      ao soltar o dedo;
//   2. ao soltar, a navegação dispara na hora. A tela de destino já foi
//      pré-carregada quando o dedo/cursor chegou no botão;
//   3. a direção (avançar / voltar) fica registrada para a tela seguinte
//      animar no sentido certo (jovi-transitions.css lê html.jovi-voltando);
//   4. em navegadores com View Transitions entre documentos (Chromium 126+,
//      Safari 18.2+), a própria navegação anima; nos demais, um fallback em
//      CSS esmaece o cartão antes de sair (html.jovi-saindo) e o faz surgir
//      na chegada (html.jovi-entrando).
//
// Carregado no <head> de todas as telas, antes de qualquer onclick inline.
(function () {
  "use strict";

  var SUPORTA_VIEW_TRANSITION = "onpagereveal" in window;
  var TEMPO_SAIDA_FALLBACK = 80;
  var DIRECAO_KEY = "jovi-direcao";
  var SELETOR_TOCAVEL = "[onclick*='joviNavegar('], [onclick*='joviVoltar('], a[href], button, [role='button']";
  var raiz = document.documentElement;
  var navegando = false;

  // Direção da navegação que trouxe até aqui (gravada pela tela anterior).
  var direcao = null;
  try { direcao = sessionStorage.getItem(DIRECAO_KEY); sessionStorage.removeItem(DIRECAO_KEY); } catch (e) {}
  if (direcao === "voltar") raiz.classList.add("jovi-voltando");
  // Voltar pelo histórico do navegador (gesto/botão do sistema) também é "voltar".
  window.addEventListener("pagereveal", function () {
    try {
      if (window.navigation && navigation.activation && navigation.activation.navigationType === "traverse") {
        raiz.classList.add("jovi-voltando");
      }
    } catch (e) {}
  });

  if (!SUPORTA_VIEW_TRANSITION) {
    raiz.classList.add("jovi-entrando");
    window.addEventListener("load", function () {
      window.setTimeout(function () { raiz.classList.remove("jovi-entrando"); }, 250);
    });
  }

  // Se a página voltar do bfcache (botão "voltar"), destrava a navegação.
  window.addEventListener("pageshow", function (evento) {
    if (evento.persisted) {
      navegando = false;
      raiz.classList.remove("jovi-saindo");
      soltarTodos();
    }
  });

  /* ------------------------------------------------ feedback de toque */
  function tocavelDe(alvo) {
    if (!alvo || alvo.nodeType !== 1 || !alvo.closest) return null;
    var el = alvo.closest(SELETOR_TOCAVEL);
    if (!el || el.disabled) return null;
    return el;
  }

  function pressionar(el) {
    if (!el || el.classList.contains("jovi-pressionado")) return;
    el.classList.remove("jovi-soltando");
    el.classList.add("jovi-pressionado");
    // A escala só entra em elementos sem transform próprio: num botão
    // centralizado com translateX(-50%) ela giraria em torno do centro
    // errado e o botão "pularia" de lado.
    if (getComputedStyle(el).transform === "none") el.classList.add("jovi-pressionado--escala");
  }

  function soltar(el) {
    if (!el || !el.classList.contains("jovi-pressionado")) return;
    el.classList.remove("jovi-pressionado", "jovi-pressionado--escala");
    el.classList.add("jovi-soltando");
    window.setTimeout(function () { el.classList.remove("jovi-soltando"); }, 200);
  }

  function soltarTodos() {
    Array.prototype.forEach.call(document.querySelectorAll(".jovi-pressionado"), soltar);
  }

  document.addEventListener("pointerdown", function (evento) {
    if (evento.button !== 0) return;
    pressionar(tocavelDe(evento.target));
  }, { capture: true, passive: true });

  // Ao soltar, o botão volta ao normal — a menos que a navegação já tenha
  // começado (aí ele fica pressionado até a tela trocar, como num app).
  ["pointerup", "pointercancel"].forEach(function (tipo) {
    document.addEventListener(tipo, function () {
      if (navegando) return;
      // Um toque rápido ainda mostra o feedback por um instante.
      window.setTimeout(function () { if (!navegando) soltarTodos(); }, 60);
    }, { capture: true, passive: true });
  });
  document.addEventListener("pointerleave", function (evento) {
    var el = tocavelDe(evento.target);
    if (el && !navegando) soltar(el);
  }, { capture: true, passive: true });

  /* ------------------------------------------------ direção */
  function pareceVoltar(el) {
    if (!el) return false;
    if (el.hasAttribute("data-voltar")) return true;
    var rotulo = (el.getAttribute("aria-label") || el.textContent || "").trim();
    return /^(voltar|fechar|←)/i.test(rotulo);
  }

  /* ------------------------------------------------ navegação */
  function elementoTocado(evento) {
    if (!evento) return null;
    var alvo = evento.currentTarget;
    if (!alvo || alvo === window || alvo === document) alvo = evento.target;
    return tocavelDe(alvo) || (alvo && alvo.nodeType === 1 ? alvo : null);
  }

  function joviNavegar(url, evento) {
    if (!url || navegando) return;
    navegando = true;

    var botao = elementoTocado(evento || window.event);
    var jaPressionado = botao && botao.classList.contains("jovi-pressionado");
    if (botao && !jaPressionado) pressionar(botao);

    try { sessionStorage.setItem(DIRECAO_KEY, pareceVoltar(botao) ? "voltar" : "avancar"); } catch (e) {}

    // Toque real: o feedback já está na tela desde o pointerdown, então a
    // navegação sai imediatamente. Teclado/programático: um instante de
    // feedback antes de sair.
    var espera = jaPressionado ? 0 : 40;
    window.setTimeout(function () {
      if (SUPORTA_VIEW_TRANSITION) {
        window.location.href = url;
        return;
      }
      raiz.classList.add("jovi-saindo");
      window.setTimeout(function () { window.location.href = url; }, TEMPO_SAIDA_FALLBACK);
    }, espera);
  }

  // Links comuns (<a href="tela-xx.html">) passam pelo mesmo fluxo, para o
  // feedback de toque ser igual ao dos botões.
  document.addEventListener("click", function (evento) {
    if (evento.defaultPrevented || evento.button !== 0) return;
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    var link = evento.target.closest ? evento.target.closest("a[href]") : null;
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || link.target === "_blank" || link.hasAttribute("download")) return;
    if (/^[a-z]+:/i.test(href) && href.indexOf(window.location.origin) !== 0) return;
    evento.preventDefault();
    joviNavegar(href, evento);
  });

  /* ------------------------------------------------ pré-carregamento */
  // Pré-carrega a tela de destino assim que o dedo/cursor chega no botão:
  // quando o toque vem, o HTML já está no cache e a transição começa na
  // hora, sem esperar a rede.
  var prefetchados = {};
  function prefetch(url) {
    if (!url || prefetchados[url] || url.charAt(0) === "#") return;
    prefetchados[url] = true;
    var link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
  }
  function destinoDe(elemento) {
    var alvo = elemento.closest ? elemento.closest("[onclick*='joviNavegar('], [onclick*='joviVoltar('], a[href]") : null;
    if (!alvo) return null;
    var oc = alvo.getAttribute("onclick");
    var m = oc && oc.match(/joviNavegar\('([^']+)'/);
    return m ? m[1] : alvo.getAttribute("href");
  }
  ["pointerenter", "pointerdown", "touchstart", "focusin"].forEach(function (tipo) {
    document.addEventListener(tipo, function (evento) {
      var url = evento.target && evento.target.nodeType === 1 ? destinoDe(evento.target) : null;
      if (url && !/^[a-z]+:/i.test(url)) prefetch(url);
    }, { capture: true, passive: true });
  });

  /* Voltar. Com a faixa de modos da câmera, várias telas passaram a ter mais
     de uma origem (a Blindagem chega dos Ajustes e também da câmera), então um
     destino fixo no botão "voltar" manda a pessoa para um lugar em que ela
     nunca esteve. Aqui: volta pelo histórico quando a tela anterior é do
     próprio app; senão, cai no destino declarado pela tela. */
  function joviVoltar(fallback, evento) {
    var veioDoApp = document.referrer && document.referrer.indexOf("/telas/") !== -1;
    if (veioDoApp && window.history.length > 1) {
      try { sessionStorage.setItem(DIRECAO_KEY, "voltar"); } catch (e) {}
      window.history.back();
      return;
    }
    joviNavegar(fallback, evento);
  }

  window.joviNavegar = joviNavegar;
  window.joviVoltar = joviVoltar;
})();
