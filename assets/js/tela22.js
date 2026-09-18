/* Tela 22 — Modo Blindagem: troca de alvo (Boleto/Pix/Anúncio/QR Code) e
   efeito de varredura ao capturar, terminando no veredito daquele alvo. */
(function () {
  "use strict";

  var frame = document.querySelector(".tela-22");
  if (!frame) return;

  var modes = frame.querySelector("[data-modes]");
  var preview = frame.querySelector("[data-preview]");
  var scanFrame = frame.querySelector("[data-scan-frame]");
  var shutter = frame.querySelector("[data-shutter]");
  var verdict = frame.querySelector("[data-verdict]");
  var verdictIcon = frame.querySelector("[data-verdict-icon] use");
  var verdictTitle = frame.querySelector("[data-verdict-title]");
  var verdictText = frame.querySelector("[data-verdict-text]");

  if (!modes || !preview || !shutter || !verdict) return;

  var STATE_ICON = {
    safe: "#i-shield-check",
    caution: "#i-shield-alert",
    danger: "#i-shield-x",
    scanning: "#i-loader"
  };

  var SCAN_DURATION = 1600;
  var scanning = false;

  function currentTarget() {
    return modes.querySelector(".camera__mode.is-active") || modes.querySelector(".camera__mode");
  }

  function setVerdict(state, title, text) {
    verdict.classList.remove("is-safe", "is-caution", "is-danger", "is-scanning");
    verdict.classList.add("is-" + state);
    if (verdictIcon) verdictIcon.setAttribute("href", STATE_ICON[state] || STATE_ICON.safe);
    if (verdictTitle) verdictTitle.textContent = title;
    if (verdictText) verdictText.textContent = text;
  }

  function applyTarget(button) {
    if (!button) return;
    var img = button.getAttribute("data-img");
    var alt = button.getAttribute("data-alt");
    if (img) preview.setAttribute("src", img);
    if (alt) preview.setAttribute("alt", alt);
  }

  // Troca de alvo: marca o botão ativo, atualiza a foto de fundo e volta o
  // veredito ao estado daquele alvo.
  modes.addEventListener("click", function (event) {
    var button = event.target.closest(".camera__mode");
    if (!button || scanning) return;
    modes.querySelectorAll(".camera__mode").forEach(function (item) {
      var active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    button.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    applyTarget(button);
    setVerdict(
      button.getAttribute("data-state") || "safe",
      button.getAttribute("data-title") || "",
      button.getAttribute("data-text") || ""
    );
  });

  shutter.addEventListener("click", function () {
    if (scanning) return;
    var target = currentTarget();
    if (!target) return;

    scanning = true;
    shutter.classList.add("is-busy");
    shutter.setAttribute("aria-busy", "true");
    if (scanFrame) scanFrame.classList.add("is-scanning");
    setVerdict("scanning", "Analisando…", "Lendo os sinais deste " + (target.textContent || "item").trim() + ".");

    window.setTimeout(function () {
      scanning = false;
      shutter.classList.remove("is-busy");
      shutter.removeAttribute("aria-busy");
      if (scanFrame) scanFrame.classList.remove("is-scanning");
      setVerdict(
        target.getAttribute("data-state") || "safe",
        target.getAttribute("data-title") || "",
        target.getAttribute("data-text") || ""
      );
    }, SCAN_DURATION);
  });
})();
