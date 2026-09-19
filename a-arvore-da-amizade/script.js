// FAQ (abre um por vez; todos começam fechados)
document.querySelectorAll('.acordeao-item').forEach(function (item, _, itens) {
  var botao = item.querySelector('button');
  botao.addEventListener('click', function () {
    var abrir = botao.getAttribute('aria-expanded') !== 'true';
    itens.forEach(function (outro) {
      var ativo = outro === item && abrir;
      outro.classList.toggle('ativo', ativo);
      outro.querySelector('button').setAttribute('aria-expanded', ativo);
      outro.querySelector('.acordeao-conteudo').hidden = !ativo;
    });
  });
});

// Botão fixo: aparece depois do CTA do topo e some na seção de oferta e no CTA final
(function () {
  var fixo = document.getElementById('fixo');
  var topo = document.getElementById('cta-hero');
  var oferta = document.getElementById('comprar');
  var final = document.querySelector('.sec-final');
  if (!fixo || !topo || !('IntersectionObserver' in window)) return;
  var visiveis = { topo: true, oferta: false, final: false };
  function atualizar() {
    fixo.hidden = visiveis.topo || visiveis.oferta || visiveis.final;
  }
  function ver(el, chave) {
    new IntersectionObserver(function (entradas) {
      visiveis[chave] = entradas[0].isIntersecting;
      atualizar();
    }).observe(el);
  }
  ver(topo, 'topo');
  ver(oferta, 'oferta');
  ver(final, 'final');
})();
