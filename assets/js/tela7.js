/* Tela 7 — Galeria: chips de categoria e bottom sheet "Criar álbum". */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- chips */
  var chipRow = document.querySelector("[data-chips]");

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
