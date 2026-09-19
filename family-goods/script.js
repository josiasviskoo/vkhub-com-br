// Acordeão (abre um por vez; o primeiro começa aberto)
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
