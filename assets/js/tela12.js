/* Tela 12 — Assistente IA: envio da pergunta.
   O botão fica sempre ativo, como no design; o envio vazio é ignorado. */
(function () {
  "use strict";

  var form = document.querySelector(".composer");
  if (!form) return;

  var input = form.querySelector(".composer__input");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (input.value.trim().length === 0) {
      input.focus();
      return;
    }
    form.reset();
    input.focus();
  });
})();
