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

  // --- Circuit Background Animation ---
  const canvas = document.getElementById('circuit-canvas');
  if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];
      // Цвета из картинки-вдохновения: Неоновый голубой и оранжевый
      const colors = ['#00E5FF', '#FF9100'];
      const particleCount = 60; // Количество частиц
      const connectionDistance = 120; // Расстояние для соединения линий

      // Установка размеров канваса
      function resizeCanvas() {
          const heroSection = document.querySelector('.hero-section');
          width = canvas.width = heroSection.offsetWidth;
          height = canvas.height = heroSection.offsetHeight;
      }

      // Класс частицы
      class Particle {
          constructor() {
              this.x = Math.random() * width;
              this.y = Math.random() * height;
              // Случайная скорость и направление
              this.vx = (Math.random() - 0.5) * 0.5;
              this.vy = (Math.random() - 0.5) * 0.5;
              // Размер квадратика
              this.size = Math.random() * 3 + 1;
              // Случайный цвет из палитры
              this.color = colors[Math.floor(Math.random() * colors.length)];
          }

          // Обновление позиции
          update() {
              this.x += this.vx;
              this.y += this.vy;

              // Отталкивание от стенок
              if (this.x < 0 || this.x > width) this.vx *= -1;
              if (this.y < 0 || this.y > height) this.vy *= -1;
          }

          // Рисование частицы (квадратик)
          draw() {
              ctx.fillStyle = this.color;
              ctx.fillRect(this.x, this.y, this.size, this.size);
          }
      }

      // Инициализация частиц
      function initParticles() {
          particles = [];
          for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle());
          }
      }

      // Главный цикл анимации
      function animate() {
          ctx.clearRect(0, 0, width, height);

          // Обновляем и рисуем частицы
          for (let i = 0; i < particles.length; i++) {
              particles[i].update();
              particles[i].draw();

              // Рисуем линии между близкими частицами
              for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < connectionDistance) {
                      // Прозрачность линии зависит от расстояния
                      const opacity = 1 - (distance / connectionDistance);
                      ctx.beginPath();
                      ctx.moveTo(particles[i].x + particles[i].size / 2, particles[i].y + particles[i].size / 2);
                      ctx.lineTo(particles[j].x + particles[j].size / 2, particles[j].y + particles[j].size / 2);

                      // Цвет линии зависит от цвета первой частицы
                      const rgb = hexToRgb(particles[i].color);
                      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
                      ctx.lineWidth = 1;
                      ctx.stroke();
                  }
              }
          }
          requestAnimationFrame(animate);
      }

      // Вспомогательная функция для конвертации HEX в RGB
      function hexToRgb(hex) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          } : null;
      }

      // Запуск
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      initParticles();
      animate();
  }
});