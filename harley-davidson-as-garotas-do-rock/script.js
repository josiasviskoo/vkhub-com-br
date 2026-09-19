// Acordeão (abre um por vez; o primeiro começa aberto)
document.querySelectorAll('.acordeao-item').forEach(function (item, _, itens) {
  var botao = item.querySelector('button');
  var conteudo = item.querySelector('.acordeao-conteudo');
  botao.addEventListener('click', function () {
    var abrir = botao.getAttribute('aria-expanded') !== 'true';
    itens.forEach(function (outro) {
      var b = outro.querySelector('button');
      var c = outro.querySelector('.acordeao-conteudo');
      var ativo = outro === item && abrir;
      outro.classList.toggle('ativo', ativo);
      b.setAttribute('aria-expanded', ativo);
      c.hidden = !ativo;
    });
  });
});

// Lightbox da galeria
(function () {
  var caixa = document.getElementById('lightbox');
  var img = caixa.querySelector('.lb-img');
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var atual = 0;
  var ultimo = null;

  function mostrar(i) {
    atual = (i + links.length) % links.length;
    img.src = links[atual].href;
    img.alt = links[atual].querySelector('img').alt;
  }
  function abrir(i) {
    ultimo = document.activeElement;
    mostrar(i);
    caixa.hidden = false;
    document.body.style.overflow = 'hidden';
    caixa.querySelector('.lb-fechar').focus();
  }
  function fechar() {
    caixa.hidden = true;
    document.body.style.overflow = '';
    if (ultimo) ultimo.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); abrir(i); });
  });
  caixa.querySelector('.lb-fechar').addEventListener('click', fechar);
  caixa.querySelector('.lb-prev').addEventListener('click', function () { mostrar(atual - 1); });
  caixa.querySelector('.lb-next').addEventListener('click', function () { mostrar(atual + 1); });
  caixa.addEventListener('click', function (e) { if (e.target === caixa) fechar(); });
  document.addEventListener('keydown', function (e) {
    if (caixa.hidden) return;
    if (e.key === 'Escape') fechar();
    else if (e.key === 'ArrowLeft') mostrar(atual - 1);
    else if (e.key === 'ArrowRight') mostrar(atual + 1);
  });
})();
