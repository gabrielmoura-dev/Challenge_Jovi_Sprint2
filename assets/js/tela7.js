/* Tela 7 — Galeria: chips de categoria e bottom sheet "Criar álbum". */
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
})();
