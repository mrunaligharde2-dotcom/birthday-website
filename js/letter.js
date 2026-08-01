// Letter Functionality
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letterContent');
const closeLetter = document.getElementById('closeLetter');
const tenThingsSection = document.getElementById('tenThingsSection');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');

if (envelope) {
    envelope.addEventListener('click', () => {
        envelope.style.display = 'none';
        letterContent.style.display = 'block';
    });
}

if (closeLetter) {
    closeLetter.addEventListener('click', () => {
        letterContent.style.display = 'none';
        envelope.style.display = 'block';
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        letterContent.style.display = 'none';
        tenThingsSection.style.display = 'flex';
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        tenThingsSection.style.display = 'none';
        letterContent.style.display = 'block';
    });
}
