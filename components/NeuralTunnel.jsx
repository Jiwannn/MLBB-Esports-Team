import { useEffect, useRef } from 'react';

export default function NeuralTunnel({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Neural strands
    let strands = [];
    const centerX = () => width / 2;
    const centerY = () => height / 2;

    class Strand {
      constructor() {
        this.reset();
      }

      reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 50 + 10;
        this.speed = Math.random() * 0.02 + 0.01;
        this.length = Math.random() * 200 + 100;
        this.width = Math.random() * 2 + 0.5;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#C0C0C0';
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.angle += this.speed;
        this.pulsePhase += this.pulseSpeed;

        // Spiral outward
        this.radius += 0.3;
        if (this.radius > Math.min(width, height) / 2) {
          this.reset();
        }
      }

      draw() {
        const cx = centerX();
        const cy = centerY();
        const x = cx + Math.cos(this.angle) * this.radius;
        const y = cy + Math.sin(this.angle) * this.radius;
        const endX = cx + Math.cos(this.angle) * (this.radius + this.length);
        const endY = cy + Math.sin(this.angle) * (this.radius + this.length);

        const opacity = this.opacity * (0.7 + Math.sin(this.pulsePhase) * 0.3);

        const gradient = ctx.createLinearGradient(x, y, endX, endY);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = opacity;
        ctx.stroke();
      }
    }

    // Nodes
    let nodes = [];
    class Node {
      constructor() {
        this.reset();
      }

      reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 200;
        this.size = Math.random() * 3 + 1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#FFFFFF';
      }

      update() {
        this.pulsePhase += this.pulseSpeed;
        this.radius += 0.2;
        if (this.radius > Math.min(width, height) / 2) {
          this.reset();
        }
      }

      draw() {
        const cx = centerX();
        const cy = centerY();
        const x = cx + Math.cos(this.angle) * this.radius;
        const y = cy + Math.sin(this.angle) * this.radius;
        const opacity = 0.5 + Math.sin(this.pulsePhase) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity * 0.2;
        ctx.fill();
      }
    }

    const init = () => {
      strands = [];
      nodes = [];

      for (let i = 0; i < 100; i++) {
        strands.push(new Strand());
      }
      for (let i = 0; i < 50; i++) {
        nodes.push(new Node());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Draw center glow
      const gradient = ctx.createRadialGradient(centerX(), centerY(), 0, centerX(), centerY(), 200);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      strands.forEach((strand) => {
        strand.update();
        strand.draw();
      });

      nodes.forEach((node) => {
        node.update();
        node.draw();
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