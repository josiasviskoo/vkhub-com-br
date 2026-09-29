// Acordeão: abre um item por vez, como no Elementor original
document.querySelectorAll('.acc-item').forEach((item) => {
  const btn = item.querySelector('.acc-title');
  btn.addEventListener('click', () => {
    const opening = !item.classList.contains('active');
    document.querySelectorAll('.acc-item.active').forEach((o) => {
      o.classList.remove('active');
      o.querySelector('.acc-title').setAttribute('aria-expanded', 'false');
    });
    if (opening) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
