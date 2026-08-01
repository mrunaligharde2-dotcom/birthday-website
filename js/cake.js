// Cake Functionality
const cakeContainer = document.getElementById('cakeContainer');
const celebrateBtn = document.getElementById('celebrateBtn');

if (cakeContainer) {
    cakeContainer.addEventListener('click', () => {
        triggerCelebration();
    });
}

if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
        triggerCelebration();
    });
}

function triggerCelebration() {
    createConfetti();
    playSound();
}

function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (!confettiContainer) return;

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = ['#d4145a', '#fbb040', '#667eea', '#ff69b4', '#ffd700'][Math.floor(Math.random() * 5)];
        confetti.style.animation = `fall ${2 + Math.random() * 1}s linear forwards`;
        confettiContainer.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

function playSound() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        // Play a cheerful sound effect if available
        audio.currentTime = 0;
    }
}

// Add fall animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
