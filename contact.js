// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    checkBusinessHours();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneInput);
        }
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Validate all fields
    if (!validateForm(form)) {
        showNotification('Lütfen tüm zorunlu alanları doldurun!', 'error');
        return;
    }
    
    // Show loading state
    const hideLoading = showLoading(submitBtn);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        hideLoading();
        showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
        form.reset();
        
        // Send to analytics or tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: 'Quote Request'
            });
        }
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError({ target: field });
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Bu alan zorunludur');
        return false;
    }
    
    // Specific validations
    if (value) {
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Geçerli bir e-posta adresi girin');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Geçerli bir telefon numarası girin');
                    return false;
                }
                break;
        }
        
        // Name validation
        if (fieldName === 'name' && value.length < 2) {
            showFieldError(field, 'Ad soyad en az 2 karakter olmalıdır');
            return false;
        }
        
        // Message validation
        if (fieldName === 'message' && value.length < 10) {
            showFieldError(field, 'Mesaj en az 10 karakter olmalıdır');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorDiv = field.parentNode.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        field.parentNode.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function isValidPhone(phone) {
    // Turkish phone number validation
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$|^(\+90|0)?[2-4][0-9]{8}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

function formatPhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('90')) {
        value = value.substring(2);
    }
    
    if (value.length > 0) {
        if (value.startsWith('5')) {
            // Mobile number formatting
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            } else if (value.length <= 8) {
                value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
            } else {
                value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
            }
        } else {
            // Landline number formatting
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            } else {
                value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 9);
            }
        }
    }
    
    e.target.value = value;
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-question i');
                otherAnswer.style.maxHeight = null;
                otherIcon.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

function checkBusinessHours() {
    const statusElement = document.querySelector('.status');
    if (!statusElement) return;
    
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    let isOpen = false;
    
    if (day >= 1 && day <= 6) { // Monday to Saturday
        isOpen = hour >= 8 && hour < 18;
    } else if (day === 0) { // Sunday
        isOpen = hour >= 9 && hour < 16;
    }
    
    if (isOpen) {
        statusElement.textContent = 'Şimdi Açık';
        statusElement.className = 'status online';
    } else {
        statusElement.textContent = 'Şimdi Kapalı';
        statusElement.className = 'status offline';
    }
}

// Auto-fill form from URL parameters
function autoFillFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('service')) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = urlParams.get('service');
        }
    }
    
    if (urlParams.has('source')) {
        // Track the source of the contact
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                event_category: 'Contact',
                event_label: urlParams.get('source')
            });
        }
    }
}

// Call auto-fill when page loads
document.addEventListener('DOMContentLoaded', autoFillFromURL);

// Estimate calculator
function calculateEstimate() {
    const area = parseFloat(document.getElementById('area').value);
    const service = document.getElementById('service').value;
    
    if (!area || !service) return;
    
    let pricePerSqm = 0;
    
    switch (service) {
        case 'ev-boyama':
            pricePerSqm = 20;
            break;
        case 'is-yeri-boyama':
            pricePerSqm = 25;
            break;
        case 'dis-cephe-boyama':
            pricePerSqm = 30;
            break;
        case 'dekoratif-boyama':
            pricePerSqm = 40;
            break;
        default:
            pricePerSqm = 25;
    }
    
    const estimate = area * pricePerSqm;
    const minEstimate = estimate * 0.8;
    const maxEstimate = estimate * 1.2;
    
    showNotification(
        `Tahmini Maliyet: ₺${minEstimate.toLocaleString()} - ₺${maxEstimate.toLocaleString()}`, 
        'info'
    );
}

// Add estimate calculation to area and service inputs
document.addEventListener('DOMContentLoaded', function() {
    const areaInput = document.getElementById('area');
    const serviceSelect = document.getElementById('service');
    
    if (areaInput && serviceSelect) {
        areaInput.addEventListener('blur', calculateEstimate);
        serviceSelect.addEventListener('change', calculateEstimate);
    }
});

// Smooth scroll to form when clicking contact buttons
function scrollToForm() {
    const form = document.querySelector('.contact-form-section');
    if (form) {
        form.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add click handlers for contact buttons
document.addEventListener('DOMContentLoaded', function() {
    const contactButtons = document.querySelectorAll('a[href*="iletisim"]');
    
    contactButtons.forEach(button => {
        if (button.href.includes('#form')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToForm();
            });
        }
    });
}); 