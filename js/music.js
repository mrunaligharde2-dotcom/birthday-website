// Music Control
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');

if (musicToggle && backgroundMusic) {
    let isPlaying = false;

    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggle.textContent = '🔊 Music';
            isPlaying = false;
        } else {
            backgroundMusic.play().catch(err => {
                console.log('Audio autoplay was prevented:', err);
            });
            musicToggle.textContent = '🔇 Muted';
            isPlaying = true;
        }
    });

    // Auto-play attempt (may be blocked by browser)
    backgroundMusic.play().catch(err => {
        console.log('Autoplay prevented. User must click to play.');
    });
}
