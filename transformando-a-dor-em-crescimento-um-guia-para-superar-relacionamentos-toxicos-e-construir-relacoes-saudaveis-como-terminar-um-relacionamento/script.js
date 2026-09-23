// Acordeão (equivalente ao widget "accordion" do Elementor): um item aberto por vez, primeiro aberto no início
(function () {
  var acc = document.querySelector('[data-accordion]');
  if (!acc) return;
  var items = acc.querySelectorAll('.acc-item');

  function set(item, open) {
    var btn = item.querySelector('.acc-btn');
    var panel = item.querySelector('.acc-content');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    panel.hidden = !open;
  }

  items.forEach(function (item) {
    item.querySelector('.acc-btn').addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      items.forEach(function (i) { set(i, false); });
      set(item, open);
    });
  });
})();

// Teste rápido do guia: conta as frases marcadas e mostra uma orientação
(function () {
  var form = document.querySelector('[data-teste]');
  if (!form) return;
  var boxes = form.querySelectorAll('input[type="checkbox"]');
  var out = form.querySelector('.teste-resultado');
  var risco = boxes[boxes.length - 1];

  form.addEventListener('change', function () {
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    if (risco.checked) {
      out.textContent = 'Você marcou que já sentiu medo pela sua segurança. Isso é sério: ligue 180 (Central de Atendimento à Mulher) ou 190 em caso de perigo imediato.';
    } else if (n === 0) {
      out.textContent = 'Marque as frases acima para ver o resultado.';
    } else if (n <= 2) {
      out.textContent = 'Você marcou ' + n + ' de ' + boxes.length + '. Fique atento(a): converse sobre isso e observe se esses comportamentos se repetem.';
    } else {
      out.textContent = 'Você marcou ' + n + ' de ' + boxes.length + '. Esses são sinais importantes de um relacionamento tóxico. Converse com alguém de confiança e procure um psicólogo.';
    }
  });
})();
