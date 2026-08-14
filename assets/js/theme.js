/* Tema da aplicação.
   A escolha do usuário vive em localStorage["theme"] e é aplicada como
   data-bs-theme no <html>. Sem escolha salva, segue o sistema.
   A tela de configurações usa AppTheme.set() para gravar a preferência. */
(function (global) {
  "use strict";

  var STORAGE_KEY = "theme";
  var root = document.documentElement;
  var media = global.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try {
      var value = global.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute("data-bs-theme", theme);
  }

  function set(theme) {
    if (theme !== "light" && theme !== "dark") return;
    try {
      global.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* modo privativo: aplica só nesta sessão */
    }
    apply(theme);
  }

  function current() {
    return root.getAttribute("data-bs-theme");
  }

  // Acompanha o sistema enquanto o usuário não tiver escolhido.
  media.addEventListener("change", function (event) {
    if (!stored()) apply(event.matches ? "dark" : "light");
  });

  global.AppTheme = { set: set, current: current, stored: stored };
})(window);
