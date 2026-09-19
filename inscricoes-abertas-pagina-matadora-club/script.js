// Alerta: botão de fechar
document.querySelectorAll('.alert-dismiss').forEach((btn) => {
  btn.addEventListener('click', () => btn.closest('.alert').remove());
});

// Acordeão: abre um item por vez, primeiro item aberto no início
document.querySelectorAll('.acc-item').forEach((item) => {
  const btn = item.querySelector('.acc-title');
  const content = item.querySelector('.acc-content');
  btn.addEventListener('click', () => {
    const opening = !item.classList.contains('active');
    document.querySelectorAll('.acc-item.active').forEach((o) => {
      o.classList.remove('active');
      o.querySelector('.acc-title').setAttribute('aria-expanded', 'false');
      o.querySelector('.acc-content').hidden = true;
    });
    if (opening) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      content.hidden = false;
    }
  });
});

// Carrossel infinito com autoplay (5s), pausa ao passar o mouse
document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const originals = Array.from(track.children);
  const total = originals.length;
  let per = 1;
  let index = 0;
  let timer;

  const perView = () => parseInt(getComputedStyle(carousel).getPropertyValue('--per'), 10) || 1;

  const build = () => {
    track.querySelectorAll('.clone').forEach((c) => c.remove());
    per = perView();
    originals.slice(-per).reverse().forEach((s) => {
      const c = s.cloneNode(true);
      c.classList.add('clone');
      c.setAttribute('aria-hidden', 'true');
      track.prepend(c);
    });
    originals.slice(0, per).forEach((s) => {
      const c = s.cloneNode(true);
      c.classList.add('clone');
      c.setAttribute('aria-hidden', 'true');
      track.append(c);
    });
    index = 0;
    move(false);
  };

  const move = (animate) => {
    const slide = track.children[0];
    const step = slide.getBoundingClientRect().width + 10;
    track.classList.toggle('anim', animate);
    track.style.transform = `translateX(${-(index + per) * step}px)`;
  };

  const go = (dir) => {
    index += dir;
    move(true);
  };

  track.addEventListener('transitionend', () => {
    if (index >= total) index -= total;
    else if (index < 0) index += total;
    else return;
    move(false);
  });

  const start = () => { stop(); timer = setInterval(() => go(1), 5000); };
  const stop = () => clearInterval(timer);

  carousel.querySelector('.prev').addEventListener('click', () => { go(-1); start(); });
  carousel.querySelector('.next').addEventListener('click', () => { go(1); start(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  let lastPer = 0;
  const onResize = () => { if (perView() !== lastPer) { lastPer = perView(); build(); } else move(false); };
  window.addEventListener('resize', onResize);
  window.addEventListener('load', () => move(false));
  onResize();
  start();
});
