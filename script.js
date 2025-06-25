// DOM yüklendikten sonra çalıştır
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Menüyü kapatmak için yardımcı fonksiyon
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
        body.style.paddingRight = '';
    }
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isActive = hamburger.classList.contains('active');
            
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Body scroll'unu kontrol et
            if (!isActive) {
                body.style.overflow = 'hidden';
                body.style.paddingRight = getScrollbarWidth() + 'px';
            } else {
                body.style.overflow = '';
                body.style.paddingRight = '';
            }
        });

        // Menü linklerine tıklandığında menüyü kapat
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', (e) => {
            // Anında kapat - hiç bekletme
            e.preventDefault();
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
            body.style.paddingRight = '';
            
            // Sonra navigation işlemini gerçekleştir
            setTimeout(() => {
                if (n.getAttribute('href')) {
                    window.location.href = n.getAttribute('href');
                }
            }, 50);
        }));

        // ESC tuşu ile menüyü kapat
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Menü dışına tıklandığında kapat
        navMenu.addEventListener('click', function(e) {
            if (e.target === navMenu) {
                closeMenu();
            }
        });
    }

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Animate on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate service cards and feature items
    document.querySelectorAll('.service-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Contact form validation (if exists)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !phone || !message) {
                showNotification('Lütfen tüm alanları doldurun!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Lütfen geçerli bir e-posta adresi girin!', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            contactForm.reset();
        });
    }


});

// Search functionality removed - no longer needed

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not present
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                min-width: 300px;
                max-width: 400px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .notification-message {
                flex: 1;
                margin-right: 10px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 14px;
                cursor: pointer;
                color: #666;
                padding: 4px;
            }
            
            .notification-success {
                border-left: 4px solid #4CAF50;
            }
            
            .notification-error {
                border-left: 4px solid #f44336;
            }
            
            .notification-warning {
                border-left: 4px solid #ff9800;
            }
            
            .notification-info {
                border-left: 4px solid #2196F3;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone number formatting
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `(${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
    }
    return phoneNumber;
}

// Loading animation
function showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<span class="loading"></span> Yükleniyor...';
    element.disabled = true;
    
    return function hideLoading() {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Image lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload on page load
window.addEventListener('load', preloadImages);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scrollbar genişliğini hesapla
function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar';
    
    document.body.appendChild(outer);
    
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';
    
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    
    const widthWithScroll = inner.offsetWidth;
    
    outer.parentNode.removeChild(outer);
    
    return widthNoScroll - widthWithScroll;
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    // Your scroll handler code here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler); 