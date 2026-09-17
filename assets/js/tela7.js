/* Tela 7 — Galeria: chips de categoria, bottom sheet "Criar álbum", ações
   de card, header (Voltar/Favoritos) e nav inferior. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- chips */
  var chipRow = document.querySelector("[data-chips]");
  var panels = document.querySelectorAll("[data-filter-panel]");

  // "Vídeos" não tem design próprio ainda — os únicos vídeos da galeria são
  // as palestras, então o chip mostra esse painel. Filtros sem painel caem
  // em "Tudo" em vez de mostrar uma tela vazia.
  var PANEL_ALIAS = { videos: "palestras" };

  function showPanel(filter) {
    if (!panels.length) return;
    filter = PANEL_ALIAS[filter] || filter;
    var hasPanel = document.querySelector('[data-filter-panel="' + filter + '"]');
    var target = hasPanel ? filter : "tudo";

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-filter-panel") !== target;
    });
  }

  if (chipRow) {
    // Arrastar para rolar (mouse ou dedo) e roda do mouse na horizontal —
    // os chips passam da largura do cartão e a barra de rolagem fica oculta.
    var arrasto = null;
    chipRow.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      arrasto = { x: event.clientX, scroll: chipRow.scrollLeft, moveu: false };
    });
    chipRow.addEventListener("pointermove", function (event) {
      if (!arrasto) return;
      var dx = event.clientX - arrasto.x;
      if (!arrasto.moveu && Math.abs(dx) < 6) return;
      if (!arrasto.moveu) {
        arrasto.moveu = true;
        chipRow.classList.add("is-arrastando");
        chipRow.setPointerCapture(event.pointerId);
      }
      chipRow.scrollLeft = arrasto.scroll - dx;
    });
    function terminarArrasto() {
      if (!arrasto) return;
      var moveu = arrasto.moveu;
      arrasto = null;
      // Solta a classe só depois do click, para um arrasto não selecionar chip.
      window.setTimeout(function () { chipRow.classList.remove("is-arrastando"); }, moveu ? 50 : 0);
    }
    chipRow.addEventListener("pointerup", terminarArrasto);
    chipRow.addEventListener("pointercancel", terminarArrasto);
    chipRow.addEventListener("wheel", function (event) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      chipRow.scrollLeft += event.deltaY;
      event.preventDefault();
    }, { passive: false });

    chipRow.addEventListener("click", function (event) {
      var chip = event.target.closest(".chip");
      if (!chip || chipRow.classList.contains("is-arrastando")) return;

      chipRow.querySelectorAll(".chip").forEach(function (item) {
        var active = item === chip;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      chip.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
      showPanel(chip.getAttribute("data-filter"));
    });
  }

  /* ---------------------------------------------------------------- sheet */
  var sheetEl = document.getElementById("sheet-criar-album");
  if (!sheetEl) return;

  var form = sheetEl.querySelector("form");
  var input = sheetEl.querySelector("#album-nome");
  var submit = sheetEl.querySelector("[data-sheet-submit]");
  var sheet = new bootstrap.Modal(sheetEl, { backdrop: true, keyboard: true });

  function syncSubmitState() {
    submit.disabled = input.value.trim().length === 0;
  }

  document.querySelectorAll("[data-open-sheet]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      sheet.show();
    });
  });

  input.addEventListener("input", syncSubmitState);

  sheetEl.addEventListener("shown.bs.modal", function () {
    input.focus();
  });

  // Ao fechar, volta ao estado inicial: campo vazio e "Criar" desabilitado.
  sheetEl.addEventListener("hidden.bs.modal", function () {
    form.reset();
    syncSubmitState();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (submit.disabled) return;
    sheet.hide();
  });

  syncSubmitState();

  /* --------------------------------------------------------------- header */
  var backBtn = document.querySelector("[data-gallery-back]");
  if (backBtn) {
    backBtn.addEventListener("click", function (event) {
      // Só volta pelo histórico se a tela anterior for do próprio app; se a
      // galeria foi aberta direto (catálogo, link externo), vai para o Início.
      var veioDoApp = document.referrer.indexOf("/telas/") !== -1;
      if (veioDoApp && window.history.length > 1) window.history.back();
      else window.joviNavegar("tela-05-inicio.html", event);
    });
  }

  var favoritesBtn = document.querySelector("[data-gallery-favorites]");
  var galleryMain = document.querySelector(".gallery");
  if (favoritesBtn && galleryMain) {
    favoritesBtn.addEventListener("click", function () {
      var active = favoritesBtn.classList.toggle("is-active");
      favoritesBtn.setAttribute("aria-pressed", String(active));
      galleryMain.classList.toggle("is-favorites-only", active);
    });
  }

  /* ------------------------------------------------------- ações de card */
  // Delegação num único listener: os cards de Esporte/Estudos/Palestras e
  // as fotos/álbuns do painel "Tudo" reaproveitam os mesmos botões/classes.
  if (galleryMain) {
    galleryMain.addEventListener("click", function (event) {
      // Palestra: tocar no card (ou no play) confirma o momento capturado —
      // o visualizador de palestra (tela-15) segue acessível pelo trilho da
      // história, não pela galeria.
      var palestra = event.target.closest('.gallery-card__play, [data-filter-panel="palestras"] .gallery-card');
      if (palestra && !event.target.closest("[data-card-action]")) {
        if (window.JoviToast) window.JoviToast.show("Momento capturado");
        return;
      }

      // tela-15 é o visualizador de PALESTRA (legenda ao vivo, transcrição) —
      // não existe, nas telas do escopo, um visualizador genérico de foto.
      // Fotos/álbuns comuns (sem tela dedicada) ficam com o placeholder.
      var tile = event.target.closest(".photo-tile, .photo-card");
      if (tile) {
        if (window.JoviToast) window.JoviToast.show("Visualizador de foto em breve");
        return;
      }

      var action = event.target.closest("[data-card-action]");
      if (!action) return;

      switch (action.getAttribute("data-card-action")) {
        case "like": {
          var liked = action.classList.toggle("is-liked");
          action.setAttribute("aria-pressed", String(liked));
          var use = action.querySelector("use");
          if (use) use.setAttribute("href", liked ? "#i-heart-filled" : "#i-heart");
          // O filtro de Favoritos (header) verifica .is-liked no card, não
          // no botão — replica o estado ali também.
          var card = action.closest(".gallery-card");
          if (card) card.classList.toggle("is-liked", liked);
          break;
        }
        case "share":
          if (window.JoviToast) window.JoviToast.show("Compartilhamento em breve");
          break;
        case "download":
          if (window.JoviToast) window.JoviToast.show("Download em breve");
          break;
      }
    });
  }

  /* ---------------------------------------------------------- nav inferior */
  var nav = document.querySelector(".bottom-nav");
  if (nav) {
    nav.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-nav]");
      if (!btn) return;

      switch (btn.getAttribute("data-nav")) {
        case "inicio":
          window.joviNavegar("tela-05-inicio.html");
          break;
        case "camera":
          window.joviNavegar("tela-13-camera.html");
          break;
        case "albuns": {
          var tudoChip = document.querySelector('[data-filter="tudo"]');
          if (tudoChip && !tudoChip.classList.contains("is-active")) tudoChip.click();
          var section = document.getElementById("sec-albuns");
          if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
        case "perfil":
          if (window.JoviToast) window.JoviToast.show("Perfil em breve");
          break;
      }
    });
  }
})();
