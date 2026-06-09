// ===== Load Components (Header & Footer) =====
async function loadComponent(elementId, filePath, callback) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Could not fetch ${filePath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        if (callback) callback();
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

// ===== Set Active Nav Link =====
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

loadComponent('header-placeholder', 'header.html', setActiveNavLink);

// ===== Initialize Newsletter Validation =====
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // e.preventDefault(); // Redirect handling is managed by form action "404.html" after validation
            if (!this.checkValidity()) {
                e.preventDefault();
                this.reportValidity();
            }
        });
    }
}

function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            event.stopPropagation(); // Stop event propagation

            contactForm.classList.add('was-validated'); // Add Bootstrap's validation styles

            if (contactForm.checkValidity()) {
                // If form is valid, redirect to 404.html
                window.location.href = '404.html';
            }
        });
    }
}

loadComponent('footer-placeholder', 'footer.html', initNewsletter);

// ===== AOS Animation Initialize =====
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ===== Back to Top =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('.count').forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        update();
    });
}

// Trigger counter when section is in view
const factSection = document.querySelector('.fact-section');
let counterStarted = false;

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counterStarted) {
        counterStarted = true;
        animateCounters();
    }
}, { threshold: 0.3 });

if (factSection) observer.observe(factSection);

// ===== Gallery Modal =====
document.querySelectorAll('.gallery-overlay[data-src]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const src = link.dataset.src;
        document.getElementById('galleryModalImg').src = src;
    });
});

// Also handle clicks without data-src (get from parent img)
document.querySelectorAll('.gallery-overlay:not([data-src])').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const img = link.closest('.gallery-item').querySelector('img');
        if (img) document.getElementById('galleryModalImg').src = img.src;
    });
});

// Initialize Contact Form Validation
document.addEventListener('DOMContentLoaded', initContactFormValidation);

// ===== Preloader Removal =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
        }, 600); // 0.6s delay for smooth transition
    }
});
