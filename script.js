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
            chip.addEventListener('click', () => {
                const val = chip.getAttribute('data-value');
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
                                limitBadge.textContent = "Select up to 3 options";
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
                    limitBadge.textContent = `${selectedValues.length}/3 Selected`;
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

});
