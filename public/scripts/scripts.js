document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.asyncCss').forEach(css => {
    css.rel = 'stylesheet';
  });
});
