/* JOVI — controle compartilhado das telas de câmera.

   Um único runtime para todas as câmeras do protótipo:
   - faixa global de modos [data-camera-modes] (ordem fixa: Blindagem,
     Estudo, Esporte, Foto, Retrato, Vídeo) — cada opção NAVEGA para a tela
     daquele modo; a opção ativa é marcada pelo HTML ou por ?modo=;
   - rolagem horizontal da faixa por toque, arraste no desktop, roda do
     mouse e setas do teclado;
   - intenções do modo Estudo [data-study-intent] (Chat / Palestra /
     Exercício), persistidas em sessionStorage e refletidas no obturador;
   - variante de vídeo da tela-12 (?modo=video) — troca o obturador para
     gravação sem duplicar a tela. */
(function () {
  "use strict";

  var DESTINOS = {
    blindagem: "tela-34-modo-blindagem.html",
    estudo: "tela-08-camera-estudo.html",
    esporte: "tela-07-modo-esporte.html",
    foto: "tela-12-camera.html",
    retrato: "tela-13-camera.html",
    video: "tela-12-camera.html?modo=video"
  };

  // Intenções do Estudo: rótulo do obturador e para onde a captura leva.
  var INTENCOES = {
    chat: { rotulo: "Capturar para o Chat", destino: "tela-09-selecao-fotos-ia.html", legenda: "Captura vai para o Chat com a IA" },
    palestra: { rotulo: "Gravar palestra", destino: "tela-14-camera-viewfinder.html", legenda: "Gravação de palestra com transcrição" },
    exercicio: { rotulo: "Fotografar exercício", destino: "tela-24-estudo-tentativa.html", legenda: "Foto do exercício para a tentativa" }
  };

  var params = new URLSearchParams(window.location.search);

  function navegar(url) {
    if (window.joviNavegar) window.joviNavegar(url);
    else window.location.href = url;
  }

  function marcarAtivo(strip, botao) {
    strip.querySelectorAll("[data-camera-mode]").forEach(function (item) {
      var ativo = item === botao;
      item.classList.toggle("is-active", ativo);
      item.setAttribute("aria-pressed", String(ativo));
    });
  }

  function initFaixa(strip) {
    // ?modo= sobrescreve o ativo do HTML (usado pela variante de vídeo).
    var modoUrl = params.get("modo");
    var botaoUrl = modoUrl && strip.querySelector('[data-camera-mode="' + modoUrl + '"]');
    if (botaoUrl) marcarAtivo(strip, botaoUrl);

    var ativo = strip.querySelector(".is-active");
    if (ativo) {
      ativo.setAttribute("aria-pressed", "true");
      // Garante o modo corrente visível, sem reordenar a lista. Roda de novo
      // quando as fontes carregam, porque as larguras dos rótulos mudam.
      var revelar = function () {
        var faixa = strip.getBoundingClientRect();
        var alvo = ativo.getBoundingClientRect();
        if (alvo.right > faixa.right) strip.scrollLeft += alvo.right - faixa.right + 12;
        else if (alvo.left < faixa.left) strip.scrollLeft -= faixa.left - alvo.left + 12;
      };
      requestAnimationFrame(revelar);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(revelar); });
      window.addEventListener("load", revelar);
    }

    // Arraste no desktop (toque já rola nativamente via overflow-x).
    var drag = null;
    strip.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch" || event.button !== 0) return;
      drag = { x: event.clientX, left: strip.scrollLeft, moved: false };
    });
    strip.addEventListener("pointermove", function (event) {
      if (!drag) return;
      var delta = event.clientX - drag.x;
      if (Math.abs(delta) > 5) {
        drag.moved = true;
        strip.classList.add("is-dragging");
        strip.scrollLeft = drag.left - delta;
      }
    });
    function soltar() {
      var moveu = drag && drag.moved;
      strip.classList.remove("is-dragging");
      // Mantém o "moveu" até o click do mesmo gesto ser descartado.
      setTimeout(function () { drag = null; }, 0);
      if (drag) drag.moved = moveu;
    }
    strip.addEventListener("pointerup", soltar);
    strip.addEventListener("pointercancel", soltar);
    strip.addEventListener("pointerleave", function () { if (drag) soltar(); });

    // Roda do mouse: vertical vira horizontal dentro da faixa.
    strip.addEventListener("wheel", function (event) {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        strip.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    }, { passive: false });

    // Teclado: setas, Home e End percorrem os modos.
    strip.addEventListener("keydown", function (event) {
      var botoes = Array.prototype.slice.call(strip.querySelectorAll("[data-camera-mode]"));
      var i = botoes.indexOf(document.activeElement);
      if (i < 0 || !/^(ArrowLeft|ArrowRight|Home|End)$/.test(event.key)) return;
      event.preventDefault();
      var proximo = event.key === "Home" ? 0
        : event.key === "End" ? botoes.length - 1
        : Math.max(0, Math.min(botoes.length - 1, i + (event.key === "ArrowRight" ? 1 : -1)));
      botoes[proximo].focus();
      botoes[proximo].scrollIntoView({ inline: "nearest", block: "nearest" });
    });

    strip.addEventListener("click", function (event) {
      var botao = event.target.closest("[data-camera-mode]");
      if (!botao || (drag && drag.moved)) return;
      if (botao.classList.contains("is-active")) return; // já está neste modo
      var destino = DESTINOS[botao.getAttribute("data-camera-mode")];
      if (destino) navegar(destino);
    });
  }

  function initIntencoes(grupo) {
    var chave = "jovi-study-intent";
    var legenda = document.querySelector("[data-study-intent-label]");
    var obturador = document.querySelector("[data-camera-shutter]");
    var salvo = null;
    try { salvo = sessionStorage.getItem(chave); } catch (e) {}

    var fixo = grupo.getAttribute("data-study-intent-fixed");
    var atual = window.location.pathname.split("/").pop();

    function aplicar(id) {
      var info = INTENCOES[id];
      if (!info) return;
      grupo.querySelectorAll("button").forEach(function (b) {
        var ativo = b.getAttribute("data-intent") === id;
        b.classList.toggle("is-active", ativo);
        b.setAttribute("aria-pressed", String(ativo));
      });
      if (legenda) legenda.textContent = info.legenda;
      if (obturador) {
        obturador.setAttribute("aria-label", info.rotulo);
        // Se a tela já É o destino da intenção, o obturador age localmente.
        if (info.destino === atual) obturador.removeAttribute("data-intent-destino");
        else obturador.setAttribute("data-intent-destino", info.destino);
      }
      try { sessionStorage.setItem(chave, id); } catch (e) {}
    }

    grupo.addEventListener("click", function (event) {
      var b = event.target.closest("button[data-intent]");
      if (!b) return;
      var id = b.getAttribute("data-intent");
      // Numa tela que representa uma intenção específica (ex.: viewfinder
      // de palestra), escolher outra intenção volta para a câmera de estudo.
      if (fixo && id !== fixo) {
        try { sessionStorage.setItem(chave, id); } catch (e) {}
        navegar(DESTINOS.estudo);
        return;
      }
      aplicar(id);
    });

    if (obturador) {
      obturador.addEventListener("click", function () {
        var destino = obturador.getAttribute("data-intent-destino");
        if (destino) navegar(destino);
      });
    }

    var inicial = fixo || (INTENCOES[salvo] ? salvo : (grupo.querySelector("button.is-active[data-intent]") || grupo.querySelector("button[data-intent]")).getAttribute("data-intent"));
    aplicar(inicial);
  }

  // Variante de vídeo (tela-12?modo=video): obturador vira "gravar".
  function initVideo() {
    if (params.get("modo") !== "video") return;
    var obturador = document.querySelector("[data-camera-shutter]");
    var cena = document.querySelector("[data-camera-scene]");
    if (obturador) {
      obturador.classList.add("is-video");
      obturador.setAttribute("aria-label", "Gravar vídeo");
      var gravando = false;
      obturador.addEventListener("click", function () {
        gravando = !gravando;
        obturador.setAttribute("aria-label", gravando ? "Parar gravação" : "Gravar vídeo");
        if (window.JoviToast) window.JoviToast.show(gravando ? "Gravando vídeo…" : "Vídeo salvo na galeria");
      });
    }
    if (cena) cena.textContent = "Show · Vídeo";
    document.documentElement.setAttribute("data-camera-variant", "video");
  }

  document.querySelectorAll("[data-camera-modes]").forEach(initFaixa);
  document.querySelectorAll("[data-study-intent]").forEach(initIntencoes);
  initVideo();
})();
