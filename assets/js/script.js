document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.btn-onboarding-primary');
  const skipBtn = document.querySelector('.btn-onboarding-secondary');

  startBtn.addEventListener('click', () => {
    console.log('Começar clicado');
  });

  skipBtn.addEventListener('click', () => {
    console.log('Pular clicado');
  });
});
