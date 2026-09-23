// Formulário: o original enviava via Elementor/WordPress (admin-ajax); aqui só valida no navegador.
(function () {
  var form = document.querySelector('form[name="RecompensaEbookLGPDGratis"]');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) form.reportValidity();
  });
})();

// Botões "Copiar texto" dos modelos de LGPD
(function () {
  document.querySelectorAll('.modelo .copiar').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var texto = btn.parentNode.querySelector('pre').textContent;
      var ok = function () {
        btn.textContent = 'Copiado!';
        setTimeout(function () { btn.textContent = 'Copiar texto'; }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(ok);
      } else {
        var area = document.createElement('textarea');
        area.value = texto;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
        ok();
      }
    });
  });
})();
