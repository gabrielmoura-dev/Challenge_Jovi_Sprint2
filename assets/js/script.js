document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.btn-onboarding-primary, .tela03-btn-primary');
  const skipBtn = document.querySelector('.btn-onboarding-secondary, .tela03-btn-secondary');

  startBtn?.addEventListener('click', () => {
    console.log('Começar clicado');
  });

  skipBtn?.addEventListener('click', () => {
    console.log('Pular clicado');
  });
});
