// Gallery functionality
let currentImageIndex = 0;
let currentFilter = 'all';
let filteredImages = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeFilters();
    initializeModal();
});

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    filteredImages = Array.from(galleryItems);
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const viewBtn = item.querySelector('.view-btn');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                openModal(viewBtn);
            });
        }
        
        // Also allow clicking on image
        img.addEventListener('click', () => {
            openModal(viewBtn);
        });
    });
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            setActiveFilter(button);
            filterGallery(filter);
        });
    });
}

function setActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

function filterGallery(filter) {
    currentFilter = filter;
    const galleryItems = document.querySelectorAll('.gallery-item');
    filteredImages = [];
    
    galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            // Animate in
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, index * 50);
            
            filteredImages.push(item);
        } else {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function initializeModal() {
    const modal = document.getElementById('imageModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'ArrowLeft') {
            prevImage();
        }
        if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
}

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    const galleryItem = element.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const title = galleryItem.querySelector('.gallery-info h3').textContent;
    const category = galleryItem.querySelector('.gallery-info p').textContent;
    
    // Find current image index in filtered images
    currentImageIndex = filteredImages.indexOf(galleryItem);
    
    // Set modal content
    modalImg.src = img.src.replace('w=500', 'w=1200'); // Get higher resolution
    modalCaption.innerHTML = `<h3>${title}</h3><p>${category}</p>`;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function nextImage() {
    if (filteredImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    updateModalImage();
}

function prevImage() {
    if (filteredImages.length === 0) return;
    
    currentImageIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    updateModalImage();
}

function updateModalImage() {
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    const currentItem = filteredImages[currentImageIndex];
    const img = currentItem.querySelector('img');
    const title = currentItem.querySelector('.gallery-info h3').textContent;
    const category = currentItem.querySelector('.gallery-info p').textContent;
    
    // Fade out
    modalImg.style.opacity = '0';
    
    setTimeout(() => {
        modalImg.src = img.src.replace('w=500', 'w=1200');
        modalCaption.innerHTML = `<h3>${title}</h3><p>${category}</p>`;
        
        // Fade in
        modalImg.style.opacity = '1';
    }, 150);
}

// Stats animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                
                let numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                animateNumber(target, 0, numericValue, 2000, isPercentage, isPlus);
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration, isPercentage = false, isPlus = false) {
    let startTime = null;
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        
        let displayValue = current.toString();
        if (isPercentage) displayValue = '%' + displayValue;
        if (isPlus) displayValue += '+';
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Initialize stats animation when DOM is loaded
document.addEventListener('DOMContentLoaded', animateStats);

// Lazy loading for gallery images
function lazyLoadGalleryImages() {
    const images = document.querySelectorAll('.gallery-item img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create placeholder effect
                img.style.filter = 'blur(5px)';
                
                // Load image
                const tempImg = new Image();
                tempImg.onload = function() {
                    img.src = this.src;
                    img.style.filter = 'none';
                    img.style.transition = 'filter 0.3s ease';
                };
                tempImg.src = img.src;
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadGalleryImages);

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const modal = document.getElementById('imageModal');
    
    if (modal.style.display === 'block') {
        if (touchEndX < touchStartX - 50) {
            nextImage(); // Swipe left - next image
        }
        if (touchEndX > touchStartX + 50) {
            prevImage(); // Swipe right - previous image
        }
    }
}

// Preload adjacent images for better performance
function preloadAdjacentImages() {
    if (filteredImages.length === 0) return;
    
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    
    // Preload next image
    const nextImg = new Image();
    const nextSrc = filteredImages[nextIndex].querySelector('img').src;
    nextImg.src = nextSrc.replace('w=500', 'w=1200');
    
    // Preload previous image
    const prevImg = new Image();
    const prevSrc = filteredImages[prevIndex].querySelector('img').src;
    prevImg.src = prevSrc.replace('w=500', 'w=1200');
}

// Call preload when modal opens
const originalOpenModal = openModal;
openModal = function(element) {
    originalOpenModal(element);
    setTimeout(preloadAdjacentImages, 500);
}; 