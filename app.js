document.addEventListener('DOMContentLoaded', () => {
  // Маска телефона
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      // Форматирование для российских номеров
      if (!x[2]) {
        e.target.value = x[1];
      } else {
        e.target.value = !x[1] ? '' : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
      }
    });
  }

  // Логика 3D эффектов удалена, так как дизайн сменен на плоский (Flat/Material) стиль Avito.
});