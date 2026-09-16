(function () {
  "use strict";

  var examples = [
    {
      photo: "../assets/img/camera-thumb-1.png",
      contour: "../assets/img/pose-guide-contour-1.svg",
      label: "Dinâmica",
      alt: "Pose frontal com as duas mãos apoiadas no rosto",
      tip: "Centralize o rosto e aproxime as mãos das bochechas."
    },
    {
      photo: "../assets/img/camera-thumb-2.png",
      contour: "../assets/img/pose-guide-contour-2.svg",
      label: "Clássica",
      alt: "Pose de três quartos segurando os óculos",
      tip: "Gire levemente o rosto e leve uma mão aos óculos."
    },
    {
      photo: "../assets/img/camera-thumb-3.png",
      contour: "../assets/img/pose-guide-contour-3.svg",
      label: "Editorial",
      alt: "Pose de perfil com o olhar voltado para a câmera",
      tip: "Vire o corpo de lado e retorne o olhar para a câmera."
    }
  ];

  var stagePhoto = document.querySelector("[data-pose-photo]");
  var stageContour = document.querySelector("[data-pose-contour]");
  var fill = document.querySelector("[data-pose-fill]");
  var label = document.querySelector("[data-pose-label]");
  var captionText = document.querySelector("[data-pose-tip-text]");
  var choices = document.querySelectorAll("[data-pose-choice]");

  if (!stagePhoto || !stageContour || !choices.length) return;

  function select(index) {
    var item = examples[index] || examples[0];
    stagePhoto.src = item.photo;
    stagePhoto.alt = item.alt;
    stageContour.hidden = !item.contour;
    if (item.contour) stageContour.src = item.contour;
    if (fill) fill.src = item.photo;
    if (label) label.textContent = item.label;
    if (captionText) captionText.textContent = item.tip;

    choices.forEach(function (choice, choiceIndex) {
      var active = choiceIndex === index;
      choice.classList.toggle("is-active", active);
      choice.setAttribute("aria-pressed", String(active));
    });
  }

  choices.forEach(function (choice) {
    choice.addEventListener("click", function () {
      select(Number(choice.dataset.poseChoice));
    });
  });

  select(Number(new URLSearchParams(window.location.search).get("pose")) || 0);
})();
