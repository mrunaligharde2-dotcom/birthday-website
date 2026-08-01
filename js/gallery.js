// Gallery Functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.querySelector('.close-lightbox');
const prevImage = document.querySelector('.prev-image');
const nextImage = document.querySelector('.next-image');

let currentImageIndex = 0;
const images = [];

galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    images.push(img.src);

    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(img.src);
    });
});

function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
}

function closeLightboxModal() {
    lightbox.classList.remove('active');
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentImageIndex];
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImage.src = images[currentImageIndex];
}

if (closeLightbox) {
    closeLightbox.addEventListener('click', closeLightboxModal);
}

if (prevImage) {
    prevImage.addEventListener('click', showPrevImage);
}

if (nextImage) {
    nextImage.addEventListener('click', showNextImage);
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightboxModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'Escape') closeLightboxModal();
    }
});
