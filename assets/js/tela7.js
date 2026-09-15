/* Tela 7 — Galeria: chips de categoria, bottom sheet "Criar álbum", ações
   de card, header (Voltar/Favoritos) e nav inferior. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- chips */
  var chipRow = document.querySelector("[data-chips]");
  var panels = document.querySelectorAll("[data-filter-panel]");

  // "Vídeos" não tem design próprio ainda — cai de volta no painel "Tudo"
  // em vez de mostrar uma tela vazia.
  function showPanel(filter) {
    if (!panels.length) return;
    var hasPanel = document.querySelector('[data-filter-panel="' + filter + '"]');
    var target = hasPanel ? filter : "tudo";

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-filter-panel") !== target;
    });
  }

  if (chipRow) {
    chipRow.addEventListener("click", function (event) {
      var chip = event.target.closest(".chip");
      if (!chip) return;

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
    backBtn.addEventListener("click", function () {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "tela-05-inicio.html";
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
      // Só o vídeo de palestra abre a tela-15: é o único conteúdo do painel
      // que bate com o que ela mostra (legenda ao vivo, transcrição).
      var play = event.target.closest(".gallery-card__play");
      if (play) {
        window.location.href = "tela-15-visualizador-midia.html";
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
          window.location.href = "tela-05-inicio.html";
          break;
        case "camera":
          window.location.href = "tela-13-camera.html";
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
