(function () {
  "use strict";
  var routes = {
    22: { album: "tela-23-prototype.html", spin: "tela-25-prototype.html", capture: "tela-24-prototype.html" },
    23: { back: "tela-22-prototype.html", spin: "tela-25-prototype.html", capture: "tela-24-prototype.html" },
    24: { back: "tela-25-prototype.html", done: "tela-26-prototype.html" },
    25: { back: "tela-22-prototype.html", spin: "tela-26-prototype.html" },
    26: { next: "tela-27-prototype.html", close: "tela-25-prototype.html" },
    27: { next: "tela-28-prototype.html", close: "tela-25-prototype.html" },
    28: { next: "tela-29-prototype.html", close: "tela-25-prototype.html" },
    29: { next: "tela-30-prototype.html", back: "tela-25-prototype.html" },
    30: { spin: "tela-25-prototype.html", capture: "tela-24-prototype.html" },
    31: { next: "tela-33-prototype.html", back: "tela-32-prototype.html" },
    32: { activate: "tela-31-prototype.html", back: "tela-17-ajustes.html" },
    33: { back: "tela-31-prototype.html" },
    34: { back: "tela-17-ajustes.html" }
  };
  function go(href) { if (href) window.location.href = href; }
  function addHotspot(frame, label, rect, href) {
    var button = document.createElement("button");
    button.type = "button"; button.className = "prototype-hotspot";
    button.setAttribute("aria-label", label);
    button.style.left = rect[0] + "px"; button.style.top = rect[1] + "px";
    button.style.width = rect[2] + "px"; button.style.height = rect[3] + "px";
    button.addEventListener("click", function () { go(href); });
    frame.appendChild(button);
  }
  document.addEventListener("DOMContentLoaded", function () {
    var frame = document.querySelector(".prototype-frame");
    if (!frame) return;
    var screen = Number(frame.dataset.screen), map = routes[screen] || {};
    var image = frame.querySelector("img");
    if (image) image.addEventListener("error", function () { frame.classList.add("image-failed"); });
    var hotspots = {
      22: [["Abrir álbum Cálculo",[20,185,320,82],map.album],["Girar a roleta",[18,193,150,36],map.spin],["Fotografar caderno novo",[20,330,320,55],map.capture]],
      23: [["Voltar",[0,44,60,60],map.back],["Girar este álbum",[20,690,320,48],map.spin],["Fotografar mais uma página",[20,742,320,48],map.capture]],
      24: [["Voltar",[0,0,62,60],map.back],["Capturar tentativa",[140,700,80,90],map.done]],
      25: [["Voltar",[0,44,60,60],map.back],["Girar",[20,680,320,58],map.spin],["Girar pela roleta",[100,210,160,270],map.spin]],
      26: [["Próxima",[20,700,320,60],map.next],["Fechar",[0,0,65,65],map.close]],
      27: [["Próxima",[20,700,320,60],map.next],["Fechar",[0,0,65,65],map.close]],
      28: [["Próxima",[20,700,320,60],map.next],["Fechar",[0,0,65,65],map.close]],
      29: [["Verificar conexões",[20,700,320,60],map.next],["Voltar",[0,0,65,65],map.back]],
      30: [["Girar de novo",[20,620,320,60],map.spin],["Fotografar mais uma página",[20,690,320,60],map.capture]],
      31: [["Simular ativação",[25,540,310,58],map.next],["Voltar",[0,0,65,65],map.back]],
      32: [["Simular ativação",[20,700,320,60],map.activate],["Voltar",[0,0,65,65],map.back]],
      33: [["Voltar",[0,0,65,65],map.back]],
      34: [["Voltar",[0,0,65,65],map.back]]
    };
    (hotspots[screen] || []).forEach(function (item) { addHotspot(frame, item[0], item[1], item[2]); });
  });
})();
