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
