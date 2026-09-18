/* Tema da aplicação — fonte única de verdade.
   A escolha do usuário vive em localStorage["theme"] ("light"/"dark") e é
   aplicada como data-bs-theme no <html>. Sem escolha salva, segue o
   sistema (prefers-color-scheme) e continua acompanhando o sistema em
   tempo real.

   O controle na UI vive DENTRO da moldura do celular: o seletor de 3 opções
   [data-appearance-option="light|dark|system"] da Tela 17 (Ajustes). Não
   existe mais botão de tema fora do frame — o protótipo é fiel à interface
   de um celular real.

   Cada tela que usa tema chama este arquivo no fim do <body>. Para evitar
   o "flash" da tela no tema errado, a tela também deve ter um pequeno
   script inline no <head> que aplica o tema salvo antes da primeira
   pintura (ver telas/tela-01-onboarding.html para o padrão). */
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

  function systemTheme() {
    return media.matches ? "dark" : "light";
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

  // Volta a seguir o tema do sistema (opção "Sistema" nos Ajustes).
  function clear() {
    try {
      global.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* modo privativo: nada para limpar */
    }
    apply(systemTheme());
  }

  function current() {
    return root.getAttribute("data-bs-theme");
  }

  // Acompanha o sistema enquanto o usuário não tiver escolhido.
  media.addEventListener("change", function (event) {
    if (!stored()) apply(event.matches ? "dark" : "light");
  });

  function syncAppearanceOptions() {
    var mode = stored() || "system";
    document.querySelectorAll("[data-appearance-option]").forEach(function (btn) {
      var active = btn.getAttribute("data-appearance-option") === mode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function refreshControls() {
    syncAppearanceOptions();
  }

  function initControls() {
    document.querySelectorAll("[data-appearance-option]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var option = btn.getAttribute("data-appearance-option");
        if (option === "system") {
          clear();
        } else {
          set(option);
        }
        refreshControls();
      });
    });

    refreshControls();
  }

  document.addEventListener("DOMContentLoaded", initControls);

  global.AppTheme = { set: set, clear: clear, current: current, stored: stored };
})(window);
