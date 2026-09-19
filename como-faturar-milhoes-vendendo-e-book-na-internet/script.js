// Acordeão (equivalente ao widget "accordion" do Elementor: um item aberto por vez)
(function () {
  var items = document.querySelectorAll('.acc-item');

  function toggle(item, open) {
    var btn = item.querySelector('button');
    var panel = item.querySelector('.acc-content');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
    panel.hidden = !open;
  }

  items.forEach(function (item) {
    item.querySelector('button').addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      items.forEach(function (other) { if (other !== item) toggle(other, false); });
      toggle(item, open);
    });
  });
})();
