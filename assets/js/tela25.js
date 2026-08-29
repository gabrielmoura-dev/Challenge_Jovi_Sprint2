// Tela 25 — Modo Farol · Alerta recebido
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var timerEl = document.getElementById("liveTimer");
    if (timerEl) {
      var seconds = 0;
      setInterval(function () {
        seconds++;
        var m = String(Math.floor(seconds / 60)).padStart(2, "0");
        var s = String(seconds % 60).padStart(2, "0");
        timerEl.textContent = m + ":" + s;
      }, 1000);
    }

    var dismiss = document.querySelector(".farol25-dismiss");
    if (dismiss) {
      dismiss.addEventListener("click", function () {
        dismiss.textContent = "Marcado como falso alarme";
        dismiss.disabled = true;
      });
    }
  });
})();
