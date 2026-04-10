// Enhanced JavaScript for PlantBoom Website
// Modern interactions and animations

(function ($) {
    'use strict';

    // ========== Document Ready ==========
    $(document).ready(function () {
        console.log('PlantBoom Enhanced - تم التحميل بنجاح!');

        initAnimations();
        initBenefitsVideo();
        initGallery();
        initScrollEffects();
        initContactForm();
        initNewsletterForm();
        initBackToTop();
        initDynamicLighting();
        initHeroTilt();
        initSearchBarInteractions();
        initProductTabs();

        // Initialize WOW.js for scroll animations
        if (typeof WOW === 'function') {
            new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 100,
                mobile: true,
                live: true
            }).init();
        }
    });

    // ========== Animations ==========
    function initAnimations() {
        // Add entrance animations to sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('.benefit-card, .step-card, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }

    function initBenefitsVideo() {
        var section = document.getElementById('benefits');
        var video = document.getElementById('benefitsVideo');
        if (!section || !video) return;
        video.muted = true;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    try { video.play(); } catch (e) { }
                } else {
                    try { video.pause(); video.currentTime = 0; } catch (e) { }
                }
            });
        }, { threshold: 0.25 });
        observer.observe(section);
    }

    // ========== Gallery ==========
    function initGallery() {
        const galleryImages = [
            './assets/images/10Kg_8.png',
            './assets/images/AVANT_3.png',
            './assets/images/En-tete_2.png',
            './assets/images/En-tete_12.png',
            './assets/images/En-tete_15.png',
            './assets/images/En-tete_17.png',
            './assets/images/3_534ff658-6c49-4755-bab9-989cae5c1a7b.png',
            './assets/images/4_42028793-323d-4dee-9ad1-4d807ff034ea.png'
        ];

        const titles = [
            'نتائج مذهلة',
            'قبل وبعد الاستخدام',
            'نباتات صحية',
            'نمو سريع',
            'أوراق خضراء زاهية',
            'حديقة مزدهرة',
            'جودة ممتازة',
            'فوائد مضمونة'
        ];

        const galleryGrid = $('#galleryGrid');

        galleryImages.forEach((img, index) => {
            const colSize = index < 4 ? 'col-6 col-md-3' : 'col-6 col-md-3';
            const galleryItem = $(`
                <div class="${colSize} mb-3">
                    <div class="gallery-item">
                        <img src="${img}" class="img-fluid" alt="${titles[index]}">
                        <div class="gallery-overlay">
                            <h6 class="mb-0">${titles[index]}</h6>
                        </div>
                    </div>
                </div>
            `);

            // Add click event for modal/lightbox
            galleryItem.find('.gallery-item').on('click', function () {
                openImageModal(img, titles[index]);
            });

            galleryGrid.append(galleryItem);
        });
    }

    // Image Modal
    function openImageModal(imageSrc, title) {
        const modal = $(`
            <div class="image-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="modal-content" style="max-width: 90%; max-height: 90%; position: relative;">
                    <button class="close-modal" style="position: absolute; top: -40px; right: 0; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.5rem;">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${imageSrc}" style="max-width: 100%; max-height: 80vh; border-radius: 10px;" alt="${title}">
                    <h4 class="text-white text-center mt-3">${title}</h4>
                </div>
            </div>
        `);

        $('body').append(modal);

        modal.fadeIn(300);

        modal.find('.close-modal, .image-modal').on('click', function (e) {
            if (e.target === this) {
                modal.fadeOut(300, function () {
                    $(this).remove();
                });
            }
        });

        // Close on ESC key
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                modal.fadeOut(300, function () {
                    $(this).remove();
                });
            }
        });
    }

    // ========== Scroll Effects ==========
    function initScrollEffects() {
        const navbar = $('.navbar');

        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 50) {
                navbar.addClass('scrolled');
            } else {
                navbar.removeClass('scrolled');
            }
        });

        // Parallax effect for hero section (optional)
        $(window).on('scroll', function () {
            const scrolled = $(window).scrollTop();
            $('.hero-overlay').css('transform', `translateY(${scrolled * 0.3}px)`);
        });
    }

    // ========== Contact Form ==========
    function initContactForm() {
        const contactForm = $('#contactForm');

        contactForm.on('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: $('#name').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                message: $('#message').val()
            };

            // Show loading state
            const submitButton = contactForm.find('button[type="submit"]');
            const originalText = submitButton.html();
            submitButton.html('<i class="fas fa-spinner fa-spin ms-2"></i> جاري الإرسال...').prop('disabled', true);

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');

                // Reset form
                contactForm[0].reset();

                // Restore button
                submitButton.html(originalText).prop('disabled', false);
            }, 1500);
        });
    }

    // ========== Newsletter Form ==========
    function initNewsletterForm() {
        $('.newsletter-form').on('submit', function (e) {
            e.preventDefault();

            const email = $(this).find('input[type="email"]').val();
            const submitButton = $(this).find('button[type="submit"]');
            const originalText = submitButton.text();

            submitButton.text('جاري الاشتراك...').prop('disabled', true);

            // Simulate subscription (replace with actual API call)
            setTimeout(() => {
                showNotification('شكراً للاشتراك! سنرسل لك أحدث العروض والنصائح.', 'success');
                $(this)[0].reset();
                submitButton.text(originalText).prop('disabled', false);
            }, 1000);
        });
    }

    // ========== Notification System ==========
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="custom-notification ${type}" style="position: fixed; top: 20px; right: 20px; z-index: 10000; background: ${type === 'success' ? '#10b981' : '#3b82f6'}; color: white; padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 400px; animation: slideInRight 0.5s ease;">
                <div class="d-flex align-items-center">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} fa-lg ms-2"></i>
                    <span>${message}</span>
                </div>
            </div>
        `);

        $('body').append(notification);

        setTimeout(() => {
            notification.fadeOut(500, function () {
                $(this).remove();
            });
        }, 4000);
    }


    // ========== Back to Top Button ==========
    function initBackToTop() {
        const backToTopBtn = $('#backToTop');

        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 300) {
                backToTopBtn.addClass('show');
            } else {
                backToTopBtn.removeClass('show');
            }
        });

        backToTopBtn.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
        });
    }

    // ========== Product Quantity Selector (if needed) ==========
    function initQuantitySelector() {
        $('.quantity-minus').on('click', function () {
            const input = $(this).siblings('.quantity-input');
            const currentValue = parseInt(input.val());
            if (currentValue > 1) {
                input.val(currentValue - 1);
                updatePrice(currentValue - 1);
            }
        });

        $('.quantity-plus').on('click', function () {
            const input = $(this).siblings('.quantity-input');
            const currentValue = parseInt(input.val());
            input.val(currentValue + 1);
            updatePrice(currentValue + 1);
        });
    }

    function updatePrice(quantity) {
        const basePrice = 299;
        const totalPrice = basePrice * quantity;
        $('.total-price').text(totalPrice + ' درهم');
    }

    // ========== Scroll Progress Indicator ==========
    function initScrollProgress() {
        const progressBar = $('<div class="scroll-progress"></div>');
        progressBar.css({
            position: 'fixed',
            top: 0,
            left: 0,
            height: '3px',
            background: 'var(--primary-green)',
            zIndex: 9999,
            transition: 'width 0.1s ease'
        });

        $('body').prepend(progressBar);

        $(window).on('scroll', function () {
            const scrollTop = $(window).scrollTop();
            const docHeight = $(document).height() - $(window).height();
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.css('width', scrollPercent + '%');
        });
    }

    // Initialize scroll progress
    initScrollProgress();

    // ========== Loading Animation ==========
    $(window).on('load', function () {
        $('.spline-fallback').fadeOut(500);
    });

    // ========== Button Click Effects ==========
    $('.btn').on('click', function () {
        const ripple = $('<span class="ripple"></span>');
        $(this).append(ripple);

        ripple.css({
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            width: '20px',
            height: '20px',
            animation: 'ripple-effect 0.6s ease-out'
        });

        setTimeout(() => ripple.remove(), 600);
    });

    // Add ripple animation to CSS
    $('<style>').text(`
        @keyframes ripple-effect {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
        }
        .btn { position: relative; overflow: hidden; }
    `).appendTo('head');

    // ========== Mobile Menu Enhancement ==========
    $('.navbar-toggler').on('click', function () {
        $(this).toggleClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.navbar').length) {
            $('.navbar-collapse').removeClass('show');
            $('.navbar-toggler').removeClass('active');
        }
    });

    // ========== Header Search Functionality ==========
    const searchInput = $('.search-input');
    const searchButton = $('.search-button');

    // Handle search button click
    searchButton.on('click', function (e) {
        e.preventDefault();
        performSearch();
    });

    // Handle Enter key in search input
    searchInput.on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.val().trim();

        if (searchTerm === '') {
            showNotification('الرجاء إدخال كلمة بحث', 'info');
            return;
        }

        // Show loading state
        const originalText = searchButton.text();
        searchButton.text('جاري البحث...').prop('disabled', true);

        // Simulate search (replace with actual search functionality)
        setTimeout(() => {
            console.log('Searching for:', searchTerm);
            showNotification(`البحث عن: ${searchTerm}`, 'success');

            // Restore button
            searchButton.text(originalText).prop('disabled', false);

            // You can add actual search logic here:
            // - Filter products
            // - Navigate to search results page
            // - Show search modal with results
        }, 800);
    }

    // Clear search on escape key
    searchInput.on('keydown', function (e) {
        if (e.which === 27) { // Escape key
            $(this).val('');
            $(this).blur();
        }
    });

    // ========== Image Lazy Loading Enhancement ==========
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ========== Console Welcome Message ==========
    console.log('%c🌱 PlantBoom - معجزة النمو 🌱', 'color: #10b981; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite Enhanced with Modern Features', 'color: #059669; font-size: 14px;');
    console.log('%cDeveloped with ❤️ for better user experience', 'color: #6b7280; font-size: 12px;');

    function initDynamicLighting() {
        var root = document.documentElement;
        function bind(selector) {
            var el = document.querySelector(selector);
            if (!el) return;
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var x = ((e.clientX - r.left) / r.width) * 100;
                var y = ((e.clientY - r.top) / r.height) * 100;
                root.style.setProperty('--light-x', x + '%');
                root.style.setProperty('--light-y', y + '%');
            });
            el.addEventListener('mouseleave', function () {
                root.style.setProperty('--light-x', '50%');
                root.style.setProperty('--light-y', '50%');
            });
        }
        bind('.hero-section');
        bind('.navbar');
    }

    function initHeroTilt() {
        var card = document.querySelector('.hero-info-card');
        if (!card) return;
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
            var rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
            card.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    function initSearchBarInteractions() {
        var bar = document.querySelector('.header-search-bar');
        if (!bar) return;
        var input = bar.querySelector('.search-input');
        if (!input) return;
        bar.addEventListener('click', function () {
            input.focus();
        });
    }

    function initProductTabs() {
        const tabs = $('.product-tab');
        const grids = $('.product-grid-container');
        const indicator = $('.tabs-indicator');

        if (!tabs.length || !grids.length) return;

        function updateIndicator($tab) {
            if (!indicator.length) return;
            const tabWidth = $tab.outerWidth();
            const leftPos = $tab.position().left;
            
            indicator.css({
                width: tabWidth + 'px',
                left: leftPos + 'px'
            });
        }

        // Initialize indicator position
        const $activeTab = tabs.filter('.active');
        if ($activeTab.length) {
            setTimeout(() => {
                updateIndicator($activeTab);
            }, 100);
        }

        // Update indicator on window resize
        $(window).on('resize', function() {
            const $active = $('.product-tab.active');
            if ($active.length) {
                indicator.css('transition', 'none');
                updateIndicator($active);
                setTimeout(() => {
                    indicator.css('transition', '');
                }, 50);
            }
        });

        tabs.on('click', function() {
            const $btn = $(this);
            const targetFilter = $btn.data('filter');

            if ($btn.hasClass('active')) return;

            // Update UI - Tabs
            tabs.removeClass('active');
            $btn.addClass('active');

            // Move indicator & add slosh
            if (indicator.length) {
                updateIndicator($btn);
                indicator.removeClass('slosh');
                // Force reflow to restart animation
                void indicator[0].offsetWidth;
                indicator.addClass('slosh');
            }

            // Switch Grids with animation
            const $currentGrid = $('.product-grid-container.active');
            const $nextGrid = $(`#${targetFilter}-grid`);

            // Phase 1: Fade out current
            $currentGrid.addClass('grid-fade-out');
            
            setTimeout(() => {
                $currentGrid.removeClass('active grid-fade-out').addClass('d-none');
                
                // Phase 2: Fade in next
                $nextGrid.removeClass('d-none').addClass('active grid-fade-in');
                
                // Phase 3: Stagger cards
                const $cards = $nextGrid.find('.col-lg-3, .col-lg-4');
                $cards.removeClass('card-stagger-in'); // Reset if needed
                
                $cards.each(function(index) {
                    const $card = $(this);
                    $card.css('animation-delay', `${index * 80}ms`);
                    $card.addClass('card-stagger-in');
                });

                // Cleanup animation class after completion
                setTimeout(() => {
                    $nextGrid.removeClass('grid-fade-in');
                }, 500);

            }, 250);
        });
    }

})(jQuery);
