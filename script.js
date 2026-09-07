// Havora Interactive Script

document.addEventListener('DOMContentLoaded', () => {

    // FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(el => {
                    el.classList.remove('active');
                    const toggle = el.querySelector('.faq-toggle');
                    if (toggle) toggle.textContent = '+';
                });
                if (!isActive) {
                    item.classList.add('active');
                    const toggle = item.querySelector('.faq-toggle');
                    if (toggle) toggle.textContent = '−';
                }
            });
        }
    });

    // Multi-Select Chips Logic (Select up to 3 options)
    const chipBtns = document.querySelectorAll('.chip-option');
    const limitBadge = document.getElementById('limit-badge');
    const hiddenInput = document.getElementById('selected-partner-matters');
    let selectedValues = [];

    if (chipBtns.length > 0) {
        chipBtns.forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                const val = chip.getAttribute('data-value') || chip.textContent.trim();
                const isSelected = chip.classList.contains('selected');

                if (isSelected) {
                    // Unselect
                    chip.classList.remove('selected');
                    selectedValues = selectedValues.filter(item => item !== val);
                } else {
                    // Check limit
                    if (selectedValues.length >= 3) {
                        if (limitBadge) {
                            limitBadge.textContent = "Maximum 3 options reached";
                            limitBadge.classList.add('warning');
                            setTimeout(() => {
                                limitBadge.textContent = selectedValues.length > 0 ? `${selectedValues.length}/3 Selected` : "Select up to 3 options";
                                limitBadge.classList.remove('warning');
                            }, 2500);
                        }
                        return;
                    }
                    // Select
                    chip.classList.add('selected');
                    selectedValues.push(val);
                }

                // Update hidden input
                if (hiddenInput) {
                    hiddenInput.value = selectedValues.join(', ');
                }

                // Update badge text counter
                if (limitBadge) {
                    limitBadge.textContent = selectedValues.length > 0 ? `${selectedValues.length}/3 Selected` : "Select up to 3 options";
                }
            });
        });
    }

    // Dynamic Navbar Active Link Handler & ScrollSpy
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Instant click active toggle
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ScrollSpy to update active link as user scrolls
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let currentSectionId = '';
            const scrollPos = window.scrollY + 200;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href && href.includes(currentSectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Auto-scrolling Hero Carousel (cycles every 3.5 seconds)
    const heroCarouselEl = document.getElementById('havoraHeroCarousel');
    if (heroCarouselEl && typeof bootstrap !== 'undefined') {
        const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
            interval: 3500,
            ride: 'carousel',
            touch: true,
            pause: false
        });
        heroCarousel.cycle();
    }

    // Scroll Reveal Observer for Sections & Cards
    const revealElements = document.querySelectorAll('.platform-card, .stand-card, .how-card, .section-header');
    if (revealElements.length > 0) {
        revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('animated-in'));
        }
    }

    // Duplicate Email & Phone Validation Logic for Waitlist Submission
    const waitlistForm = document.getElementById('standalone-waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            const emailInput = document.getElementById('email-address');
            const phoneInput = document.getElementById('phone-no');

            // Clear previous feedback alerts & red borders
            let errorAlert = document.getElementById('duplicate-error-alert');
            if (errorAlert) {
                errorAlert.remove();
            }

            if (emailInput) emailInput.classList.remove('is-invalid');
            if (phoneInput) phoneInput.classList.remove('is-invalid');

            const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const rawPhone = phoneInput ? phoneInput.value.trim() : '';
            const phoneVal = rawPhone.replace(/[\s\-\(\)\+]/g, '');

            // Retrieve stored registrations
            let storedSubmissions = [];
            try {
                const storedData = localStorage.getItem('havora_waitlist_submissions');
                if (storedData) {
                    storedSubmissions = JSON.parse(storedData);
                }
            } catch (err) {
                storedSubmissions = [];
            }

            let duplicateType = null;
            let duplicateValue = '';

            for (const sub of storedSubmissions) {
                if (emailVal && sub.email === emailVal) {
                    duplicateType = 'email';
                    duplicateValue = emailInput.value.trim();
                    break;
                }
                if (phoneVal && sub.phone && sub.phone === phoneVal) {
                    duplicateType = 'phone';
                    duplicateValue = rawPhone;
                    break;
                }
            }

            if (duplicateType) {
                e.preventDefault(); // Stop form submission!

                // Create error alert banner above form
                errorAlert = document.createElement('div');
                errorAlert.id = 'duplicate-error-alert';
                errorAlert.className = 'alert alert-danger d-flex align-items-start gap-2 mb-4 rounded-3 border-danger shadow-sm';
                errorAlert.innerHTML = `
                    <div class="fs-4 lh-1">⚠️</div>
                    <div>
                        <strong>Already Registered!</strong><br>
                        ${duplicateType === 'email' 
                            ? `The email address <code>${duplicateValue}</code> is already registered on the waitlist.` 
                            : `The phone number <code>${duplicateValue}</code> is already registered on the waitlist.`}
                        <br><small class="text-muted">Each person can only join the waitlist once.</small>
                    </div>
                `;

                waitlistForm.prepend(errorAlert);

                if (duplicateType === 'email' && emailInput) {
                    emailInput.classList.add('is-invalid');
                    emailInput.focus();
                } else if (duplicateType === 'phone' && phoneInput) {
                    phoneInput.classList.add('is-invalid');
                    phoneInput.focus();
                }
                return false;
            }

            // Save new valid submission to localStorage
            storedSubmissions.push({
                email: emailVal,
                phone: phoneVal,
                date: new Date().toISOString()
            });

            try {
                localStorage.setItem('havora_waitlist_submissions', JSON.stringify(storedSubmissions));
            } catch (err) {
                console.warn('Could not save to localStorage:', err);
            }
        });
    }

});
