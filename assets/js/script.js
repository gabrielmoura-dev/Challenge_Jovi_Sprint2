/* Onboarding — navegação compartilhada entre as Telas 01-04.
   "Começar"/"Próximo" (data-onboarding-start) avança para a etapa indicada
   em data-next; "Pular" (data-onboarding-skip) encerra o onboarding e vai
   direto para a Tela 05, de qualquer uma das 4 etapas — pular significa
   pular o onboarding inteiro, não só o passo atual.
   Na Tela 2, o nome digitado é salvo (se preenchido) para uso posterior. */
(function () {
  "use strict";

  var NAME_KEY = "jovi-user-name";

  document.addEventListener("DOMContentLoaded", function () {
    var nameInput = document.querySelector("[data-onboarding-name]");

    var startBtn = document.querySelector("[data-onboarding-start]");
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        if (nameInput) {
          var value = nameInput.value.trim();
          if (value) {
            try {
              localStorage.setItem(NAME_KEY, value);
            } catch (e) {
              /* modo privativo: segue sem salvar */
            }
          }
        }
        var next = startBtn.getAttribute("data-next");
        if (next) window.location.href = next;
      });
    }

    var skipBtn = document.querySelector("[data-onboarding-skip]");
    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        var next = skipBtn.getAttribute("data-next") || "tela-05-inicio.html";
        window.location.href = next;
      });
    }
  });
})();
