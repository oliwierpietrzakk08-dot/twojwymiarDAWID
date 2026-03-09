'use strict';

/**
 * Zmienna do przechowywania offsetu nav-bar
 */
const NAV_HEIGHT = 80;

/**
 * 1. Mobile Menu & Navigation Background
 */
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');

// Show logos if they load successfully
document.querySelectorAll('img[src="images/logo.png"]').forEach(img => {
    img.onload = () => { img.style.display = 'block'; };
    // If image is already cached and loaded
    if (img.complete && img.naturalHeight !== 0) {
        img.style.display = 'block';
    }
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

// Navigation background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/**
 * 2. Scroll-spy & Smooth Scroll
 */
const sections = document.querySelectorAll('section');

// Intersection Observer do zaznaczania aktywnego linku w nawigacji
const observerOptions = {
    root: null,
    rootMargin: `-${NAV_HEIGHT + 10}px 0px -60% 0px`,
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Check if we are on the main page
            const isMainPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
            
            if (isMainPage) {
                navLinks.forEach(link => {
                    // Only remove active state from hash links on the main page.
                    if (link.getAttribute('href').includes('#')) {
                        link.classList.remove('active');
                        // Exact match for #id or index.html#id
                        if (link.getAttribute('href') === `#${id}` || link.getAttribute('href') === `index.html#${id}`) {
                            link.classList.add('active');
                        }
                    }
                });
            }
        }
    });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

// Smooth scrolling for anchor links with offset
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetHref = this.getAttribute('href');
        const isMainPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
        
        // Only prevent default and smooth scroll if we are on the main page
        // and navigating to a section, OR if it's purely a hash link like #hero
        if (targetHref.startsWith('#') || (isMainPage && targetHref.includes('#'))) {
            e.preventDefault();
            const targetId = targetHref.split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - NAV_HEIGHT;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});


/**
 * 3. Reveal on Scroll Animation
 */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => revealObserver.observe(el));


/**
 * 4. Portfolio Filters
 */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Zmiana aktywnego przycisku
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filtrowanie z płynnym znikaniem (opcjonalnie, ale klasa .hide wystarczy)
        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    });
});


/**
 * 5. Floating Labels logic (Fallback dla starszych przeglądarek / zaawansowana logika)
 * Chociaż CSS załatwia to pseudo-klasą :placeholder-shown, warto dodać obsługę w JS dla pewności.
 */
const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if(input.value.trim() !== '') {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    });
});


/**
 * 6. Form Validation
 */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

    // Pobranie elementów Error Messages i pól
    const nameInput = document.getElementById('name');
    const email = document.getElementById('email');
    const tel = document.getElementById('tel');
    const message = document.getElementById('message');

    // Walidacja Imię i Nazwisko
    if (nameInput.value.trim().length < 3) {
        showError(nameInput, 'Wprowadź poprawne imię i nazwisko');
        isValid = false;
    } else {
        clearError(nameInput);
    }

    // Walidacja Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Wprowadź poprawny adres e-mail');
        isValid = false;
    } else {
        clearError(email);
    }

    // Walidacja Telefonu
    const telRegex = /^[0-9]{9}$/;
    // Usuwamy spacje i myślniki potencjalnie wpisane przez usera
    const telClean = tel.value.replace(/[\s-]/g, '');
    if (!telRegex.test(telClean)) {
        showError(tel, 'Wprowadź poprawny 9-cyfrowy numer telefonu');
        isValid = false;
    } else {
        clearError(tel);
    }

    // Walidacja Wiadomości
    if (message.value.trim().length < 10) {
        showError(message, 'Wiadomość musi zawierać minimum 10 znaków');
        isValid = false;
    } else {
        clearError(message);
    }

    if (isValid) {
        // Symulacja wysyłania
        const btn = contactForm.querySelector('.btn-submit');
        const orgText = btn.textContent;
        btn.textContent = 'Wysyłanie...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Wiadomość wysłana!';
            btn.style.backgroundColor = '#4CAF50';
            btn.style.borderColor = '#4CAF50';
            contactForm.reset();
            
            // Czysty reset formularza (usuwa :placeholder-shown focus)
            inputs.forEach(input => input.classList.remove('has-value'));

            setTimeout(() => {
                btn.textContent = orgText;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    }
});
}

function showError(inputElement, msg) {
    const errorSpan = inputElement.parentElement.querySelector('.error-msg');
    errorSpan.textContent = msg;
    inputElement.style.borderBottomColor = '#D32F2F';
}

function clearError(inputElement) {
    const errorSpan = inputElement.parentElement.querySelector('.error-msg');
    errorSpan.textContent = '';
    inputElement.style.borderBottomColor = '';
}


/**
 * 7. Pricing Calculator Logic
 */
let currentStep = 1;
const totalSteps = 4;
const steps = document.querySelectorAll('.calc-step');
const stepIndicators = document.querySelectorAll('.stepper .step');
const btnCalculate = document.getElementById('btn-calculate');
const calcTotalDisplay = document.getElementById('calc-total');

// Nasłuchanie przycisków Dalej i Wstecz wewnątrz kroków
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Walidacja wyboru przed przejściem dalej
        let isValid = false;
        if(currentStep === 1) isValid = document.querySelector('input[name="calc-type"]:checked');
        if(currentStep === 2) isValid = document.querySelector('input[name="calc-size"]:checked');
        
        // Custom button for calculate also acts as next but with a twist, handled below.
        if (e.target.id === 'btn-calculate') return; 

        if (isValid) {
            goToStep(currentStep + 1);
        } else {
            alert('Proszę wybrać jedną z opcji przed przejściem dalej.');
        }
    });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
        if(currentStep === 4) {
            // Oblicz ponownie -> powrót do kroku 1
            resetCalculator();
        } else {
            goToStep(currentStep - 1);
        }
    });
});

// Calculate Final amount
if(btnCalculate) {
    btnCalculate.addEventListener('click', () => {
        const typeEl = document.querySelector('input[name="calc-type"]:checked');
        const sizeEl = document.querySelector('input[name="calc-size"]:checked');
        const standardEl = document.querySelector('input[name="calc-standard"]:checked');

        if (!standardEl) {
            alert('Proszę wybrać jedną z opcji jakości przed przejściem dalej.');
            return;
        }

        if (typeEl && sizeEl && standardEl) {
            const basePrice = parseInt(typeEl.value);
            // Zwiększenie ceny o 130%
            const increasedBasePrice = Math.round(basePrice * 2.3); 
            const sizeValue = parseFloat(sizeEl.value);
            const multiplier = parseFloat(standardEl.value);
            
            const total = Math.round(increasedBasePrice * sizeValue * multiplier);
            
            // Formatowanie ceny ze spacjami na tysiące
            calcTotalDisplay.textContent = total.toLocaleString('pl-PL') + ' zł';
            
            goToStep(4);
        }
    });
}

function goToStep(stepNum) {
    // Hide all steps
    steps.forEach(s => s.classList.remove('active'));
    // Show current step
    document.getElementById(`step-${stepNum}`).classList.add('active');

    // Update stepper styling
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        if (index < stepNum - 1) {
            indicator.classList.add('completed');
        } else if (index === stepNum - 1) {
            indicator.classList.add('active');
        }
    });

    currentStep = stepNum;
}

function resetCalculator() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    goToStep(1);
}
