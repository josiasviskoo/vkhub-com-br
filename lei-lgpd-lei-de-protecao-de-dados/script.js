// Formulário: o original enviava via Elementor/WordPress (admin-ajax); aqui só valida no navegador.
(function () {
  var form = document.querySelector('form[name="RecompensaEbookLGPDGratis"]');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) form.reportValidity();
  });
})();
