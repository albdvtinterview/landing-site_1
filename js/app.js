document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. МАСКА ТЕЛЕФОНА
  // ==========================================
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

  // ==========================================
  // 2. АНИМАЦИЯ ФОНА (Circuit Background)
  // ==========================================
  const canvas = document.getElementById('circuit-canvas');
  if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];

      const colors = ['#00E5FF', '#FF9100'];
      const particleCount = 60;
      const connectionDistance = 120;

      function resizeCanvas() {
          const heroSection = document.querySelector('.hero-section');
          if (heroSection) {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
          }
      }

      class Particle {
          constructor() {
              this.x = Math.random() * width;
              this.y = Math.random() * height;
              this.vx = (Math.random() - 0.5) * 0.5;
              this.vy = (Math.random() - 0.5) * 0.5;
              this.size = Math.random() * 3 + 1;
              this.color = colors[Math.floor(Math.random() * colors.length)];
          }

          update() {
              this.x += this.vx;
              this.y += this.vy;
              if (this.x < 0 || this.x > width) this.vx *= -1;
              if (this.y < 0 || this.y > height) this.vy *= -1;
          }

          draw() {
              ctx.fillStyle = this.color;
              ctx.fillRect(this.x, this.y, this.size, this.size);
          }
      }

      function initParticles() {
          particles = [];
          for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle());
          }
      }

      function animate() {
          ctx.clearRect(0, 0, width, height);

          for (let i = 0; i < particles.length; i++) {
              particles[i].update();
              particles[i].draw();

              for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < connectionDistance) {
                      const opacity = 1 - (distance / connectionDistance);
                      ctx.beginPath();
                      ctx.moveTo(particles[i].x + particles[i].size / 2, particles[i].y + particles[i].size / 2);
                      ctx.lineTo(particles[j].x + particles[j].size / 2, particles[j].y + particles[j].size / 2);

                      const rgb = hexToRgb(particles[i].color);
                      if (rgb) {
                        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                      }
                  }
              }
          }
          requestAnimationFrame(animate);
      }

      function hexToRgb(hex) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          } : null;
      }

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      initParticles();
      animate();
  }

  // ==========================================
  // 3. SPACESHIP CONTROLLER
  // ==========================================
  class SpaceshipController {
    constructor() {
      this.container = document.querySelector('.hero-section');
      this.ship = document.getElementById('hero-ship');

      if (!this.container || !this.ship) return;
      this.init();
    }

    init() {
      // Плавное появление
      const showShip = () => {
        this.ship.classList.add('loaded');
      };

      if (this.ship.complete) {
        showShip();
      } else {
        this.ship.onload = showShip;
      }

      // Parallax эффект
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      window.addEventListener('scroll', () => this.handleScroll());
    }

    handleMouseMove(e) {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.02;
      const moveY = y * 0.03;
      const rotateX = y * -0.01;
      const rotateY = x * 0.01;

      requestAnimationFrame(() => {
        this.ship.style.transform = `
          translate(${moveX}px, ${moveY}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    }

    handleScroll() {
      const scrollY = window.scrollY;
      if (scrollY < 800) {
        requestAnimationFrame(() => {
           // Легкий сдвиг для глубины
           this.ship.style.top = `calc(45% + ${scrollY * 0.1}px)`;
        });
      }
    }
  }

  new SpaceshipController();

});