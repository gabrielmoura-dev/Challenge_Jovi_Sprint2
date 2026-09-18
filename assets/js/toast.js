/* Toast simples e reutilizável — placeholder "Em breve" pra ações sem tela
   dedicada no protótipo (usa o componente Toast do Bootstrap, já carregado
   em todas as telas via bootstrap.bundle.min.js). Chame window.JoviToast.show(
   "mensagem") de qualquer script de tela; o container é criado sozinho na
   primeira chamada.

   Atalho declarativo: qualquer botão com data-toast="mensagem" já dispara
   o toast sozinho, sem precisar de JS extra na tela (basta incluir este
   arquivo). */
(function (global) {
  "use strict";

  var container = null;

  function ensureContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.className = "jovi-toast-container";
    (document.querySelector(".app-frame, .lacar-phone-frame, .phone-frame") || document.body).appendChild(container);
    return container;
  }

  function show(message) {
    var host = ensureContainer();
    var el = document.createElement("div");
    el.className = "jovi-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-atomic", "true");
    var body = document.createElement('div');
    body.className = 'toast-body';
    body.textContent = message;
    el.appendChild(body);
    host.appendChild(el);

    if (global.bootstrap && global.bootstrap.Toast) {
      var toast = new global.bootstrap.Toast(el, { delay: 1800 });
      el.addEventListener("hidden.bs.toast", function () { el.remove(); });
      toast.show();
    } else {
      // Fallback caso o bundle do Bootstrap não tenha carregado.
      el.classList.add("show");
      setTimeout(function () { el.remove(); }, 1800);
    }
  }

  global.JoviToast = { show: show };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-toast]").forEach(function (el) {
      el.addEventListener("click", function () {
        show(el.getAttribute("data-toast"));
      });
    });
  });
})(window);
