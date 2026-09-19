// Acordeão (um item aberto por vez, como o widget original)
(function () {
  var itens = document.querySelectorAll('.acordeao .item');
  itens.forEach(function (item) {
    var tab = item.querySelector('.tab');
    tab.addEventListener('click', function () {
      var abrir = !item.classList.contains('ativo');
      itens.forEach(function (i) {
        i.classList.remove('ativo');
        i.querySelector('.tab').setAttribute('aria-expanded', 'false');
      });
      if (abrir) {
        item.classList.add('ativo');
        tab.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// Carrossel de imagens (3 por vez, infinito, autoplay 1000ms, transição 200ms)
(function () {
  var wrap = document.querySelector('.carrossel');
  if (!wrap) return;
  var trilho = wrap.querySelector('.trilho');
  var originais = Array.prototype.slice.call(trilho.children);
  var total = originais.length, visiveis = 3, i = 0, timer = null, parado = false, anim = false;
  var VEL = 200, ATRASO = 1000;

  function calcVisiveis() {
    var w = window.innerWidth;
    return w <= 767 ? 1 : 3;
  }
  function montar() {
    Array.prototype.slice.call(trilho.querySelectorAll('[data-clone]')).forEach(function (c) { c.remove(); });
    visiveis = calcVisiveis();
    originais.forEach(function (s) { s.style.flexBasis = (100 / visiveis) + '%'; });
    originais.slice(0, visiveis).forEach(function (s) {
      var c = s.cloneNode(true);
      c.setAttribute('data-clone', '');
      c.setAttribute('aria-hidden', 'true');
      trilho.appendChild(c);
    });
    ir(i % total, false);
  }
  function ir(n, animar) {
    i = n;
    trilho.style.transition = animar ? 'transform ' + VEL + 'ms ease' : 'none';
    trilho.style.transform = 'translateX(' + (-i * 100 / visiveis) + '%)';
  }
  function mover(dir) {
    if (anim) return;
    anim = true;
    if (dir < 0 && i === 0) {
      ir(total, false);
      trilho.getBoundingClientRect();
    }
    ir(i + dir, true);
    setTimeout(function () {
      if (i >= total) ir(i - total, false);
      anim = false;
    }, VEL);
  }
  function agendar() {
    clearTimeout(timer);
    if (parado) return;
    timer = setTimeout(function () { mover(1); agendar(); }, ATRASO + VEL);
  }

  wrap.querySelector('.next').addEventListener('click', function () { mover(1); parado = true; clearTimeout(timer); });
  wrap.querySelector('.prev').addEventListener('click', function () { mover(-1); parado = true; clearTimeout(timer); });
  wrap.addEventListener('mouseenter', function () { clearTimeout(timer); });
  wrap.addEventListener('mouseleave', agendar);
  window.addEventListener('resize', montar);

  montar();
  agendar();
})();
