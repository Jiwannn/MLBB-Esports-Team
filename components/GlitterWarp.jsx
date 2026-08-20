import { useEffect, useRef } from 'react';

export default function GlitterWarp({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Stars array
    let stars = [];
    // Shooting stars array
    let shootingStars = [];

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#C0C0C0';
      }

      update() {
        this.twinklePhase += this.twinkleSpeed;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * (0.5 + Math.sin(this.twinklePhase) * 0.5);
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 4 + 2;
        this.angle = Math.random() * (Math.PI / 4) + Math.PI / 4;
        this.opacity = 0;
        this.fading = false;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#FFFFFF';
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (!this.fading) {
          this.opacity += 0.02;
          if (this.opacity >= 1) this.fading = true;
        } else {
          this.opacity -= 0.01;
        }

        if (this.x > width + 100 || this.y > height + 100 || this.opacity <= 0) {
          this.reset();
          this.opacity = 0;
          this.fading = false;
        }
      }

      draw() {
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.globalAlpha = this.opacity;
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }

    const init = () => {
      stars = [];
      shootingStars = [];

      // Create static stars
      for (let i = 0; i < 200; i++) {
        stars.push(new Star());
      }

      // Create shooting stars
      for (let i = 0; i < 3; i++) {
        const shootingStar = new ShootingStar();
        shootingStar.opacity = Math.random() * 0.5;
        shootingStars.push(shootingStar);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Draw shooting stars
      shootingStars.forEach((shootingStar) => {
        shootingStar.update();
        shootingStar.draw();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}