// Fireworks Effect
const fireworksCanvas = document.getElementById('fireworksCanvas');
if (fireworksCanvas) {
    const ctx = fireworksCanvas.getContext('2d');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

    const particles = [];

    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8 - 2;
            this.size = Math.random() * 3 + 2;
            this.opacity = 1;
            this.color = ['#ff6b6b', '#ff8787', '#ffa8a8', '#ffc0a0', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 6)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // gravity
            this.opacity -= 0.015;
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function createFireworks(x, y) {
        for (let i = 0; i < 30; i++) {
            particles.push(new Firework(x, y));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
            }
        }
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    fireworksCanvas.addEventListener('click', (e) => {
        createFireworks(e.clientX, e.clientY);
        animate();
    });

    window.addEventListener('resize', () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    });
}
