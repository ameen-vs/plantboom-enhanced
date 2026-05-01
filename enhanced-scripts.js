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
        initSearchBarInteractions();
        initProductTabs();
        initAtmosphere('performance', 'leafCanvasDashboard', 'cursorGlowDashboard');
        initAtmosphere('testimonials', 'leafCanvasTestimonials', 'cursorGlowTestimonials');
        initAtmosphere('faq', 'leafCanvasFAQ', 'cursorGlowFAQ');
        initAtmosphere('contact', 'leafCanvasContact', 'cursorGlowContact');
        initAtmosphere('home', null, 'cursorGlowHero');
        initDashboard();
        initHeroCarousel();

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
        $(window).on('resize', function () {
            const $active = $('.product-tab.active');
            if ($active.length) {
                indicator.css('transition', 'none');
                updateIndicator($active);
                setTimeout(() => {
                    indicator.css('transition', '');
                }, 50);
            }
        });

        tabs.on('click', function () {
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

                $cards.each(function (index) {
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

    // ========== Unified Atmosphere Engine (Deep Forest) ==========
    function initAtmosphere(sectionId, canvasId, glowId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // --- 1. Floating Leaves Canvas ---
        const lc = document.getElementById(canvasId);
        if (lc) {
            const ctx = lc.getContext('2d');
            const resizeLc = () => {
                lc.width = section.offsetWidth;
                lc.height = section.offsetHeight;
            };
            resizeLc();
            window.addEventListener('resize', resizeLc);

            const leaves = Array.from({ length: 15 }, () => ({
                x: Math.random() * lc.width,
                y: Math.random() * lc.height,
                size: 6 + Math.random() * 10,
                speed: 0.15 + Math.random() * 0.3,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.01,
                opacity: 0.04 + Math.random() * 0.06,
                drift: (Math.random() - 0.5) * 0.2,
                green: Math.random() > 0.45
            }));

            function drawLeaf(lx, ly, sz, angle, opacity, green) {
                ctx.save();
                ctx.translate(lx, ly);
                ctx.rotate(angle);
                ctx.globalAlpha = opacity;
                const c = green ? 'rgba(45,190,96,' : 'rgba(100,200,130,';
                ctx.beginPath();
                ctx.moveTo(0, -sz);
                ctx.bezierCurveTo(sz * 0.85, -sz * 0.45, sz * 0.85, sz * 0.45, 0, sz);
                ctx.bezierCurveTo(-sz * 0.85, sz * 0.45, -sz * 0.85, -sz * 0.45, 0, -sz);
                ctx.fillStyle = c + '0.85)';
                ctx.fill();
                ctx.restore();
            }

            let isAnimating = false;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!isAnimating) {
                            isAnimating = true;
                            animLeaves();
                        }
                    } else {
                        isAnimating = false;
                    }
                });
            }, { threshold: 0.05 });

            observer.observe(section);

            function animLeaves() {
                if (!document.getElementById(sectionId) || !isAnimating) return; // Stop if removed or out of view
                ctx.clearRect(0, 0, lc.width, lc.height);
                leaves.forEach(l => {
                    l.y -= l.speed;
                    l.x += l.drift;
                    l.angle += l.rotSpeed;
                    if (l.y < -20) { l.y = lc.height + 20; l.x = Math.random() * lc.width; }
                    if (l.x < -30 || l.x > lc.width + 30) l.x = Math.random() * lc.width;
                    drawLeaf(l.x, l.y, l.size, l.angle, l.opacity, l.green);
                });

                if (isAnimating) {
                    requestAnimationFrame(animLeaves);
                }
            }
        }

        // --- 2. Cursor Glow ---
        const glow = document.getElementById(glowId);
        if (glow) {
            section.addEventListener('mousemove', e => {
                const rect = section.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';
                glow.style.opacity = '1';
            });
            section.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
        }
    }

    function initDashboard() {
        const dashSection = document.getElementById('performance');
        if (!dashSection) return;

        // --- 3. Sparklines Algorithm ---
        function drawSparkline(id, data, color) {
            const canvas = document.getElementById(id);
            if (!canvas) return;
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = 35;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            const min = Math.min(...data);
            const max = Math.max(...data);
            const range = max - min || 1;
            const points = data.map((v, i) => ({
                x: (i / (data.length - 1)) * w,
                y: h - ((v - min) / range) * (h - 6) - 3
            }));

            ctx.clearRect(0, 0, w, h);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Fill
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.1)');
            ctx.fill();
        }

        drawSparkline('sp1', [60, 70, 65, 80, 75, 90, 85, 95], 'rgb(45, 190, 96)');
        drawSparkline('sp2', [40, 55, 50, 70, 65, 80, 75, 90], 'rgb(45, 190, 96)');
        drawSparkline('sp3', [30, 40, 38, 50, 45, 55, 52, 60], 'rgb(45, 190, 96)');
        drawSparkline('sp4', [10, 8, 12, 9, 14, 11, 16, 13], 'rgb(224, 90, 90)');

        // --- 4. Revenue Big Chart ---
        const revCtx = document.getElementById('revChartCustom');
        if (revCtx) {
            const labels = Array.from({ length: 18 }, (_, i) => String(i + 1));
            const thisMonth = [2100, 2450, 1980, 3100, 2800, 3500, 3200, 2600, 3800, 3400, 2900, 3600, 3100, 2700, 3300, 2500, 3700, 2200];
            const lastMonth = [1800, 2200, 2600, 2900, 2700, 3100, 2800, 2500, 3000, 2800, 2600, 3200, 2700, 2400, 3000, 2300, 3100, 1900];

            new Chart(revCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'الشهر الحالي',
                            data: thisMonth,
                            borderColor: '#2dbe60',
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.4,
                            fill: true,
                            backgroundColor: 'rgba(45, 190, 96, 0.05)'
                        },
                        {
                            label: 'الشهر السابق',
                            data: lastMonth,
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            borderDash: [5, 5],
                            borderWidth: 1.5,
                            pointRadius: 0,
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(10, 21, 16, 0.9)',
                            titleColor: '#fff',
                            bodyColor: 'rgba(255, 255, 255, 0.7)',
                            borderColor: 'rgba(45, 190, 96, 0.3)',
                            borderWidth: 1,
                            callbacks: {
                                label: context => ` $${(context.parsed.y / 1000).toFixed(1)}K`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 9 }, color: 'rgba(255, 255, 255, 0.3)' }
                        },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: {
                                font: { size: 9, family: 'DM Mono' },
                                color: 'rgba(255, 255, 255, 0.3)',
                                callback: val => '$' + (val / 1000).toFixed(0) + 'K'
                            },
                            border: { display: false }
                        }
                    }
                }
            });
        }

        // --- 5. Data Population (Staggered) ---
        const products = [
            { name: 'جرين بوستر بريميوم', cat: 'أرض', rev: '5490 دم', pct: 100, color: '#2dbe60', icon: '🌿' },
            { name: 'جرين بوستر 10 كجم', cat: 'ديكور', rev: '1200 دم', pct: 77, color: '#6ab4f5', icon: '🪴' },
            { name: 'تربة عضوية معالجة', cat: 'أرض', rev: '3230 دم', pct: 64, color: '#efb840', icon: '🌱' },
            { name: 'طقم بذور الربيع', cat: 'بذور', rev: '800 دم', pct: 51, color: '#2dbe60', icon: '🌸' },
            { name: 'مزهرية ديكور 1', cat: 'أدوات', rev: '450 دم', pct: 41, color: '#6ab4f5', icon: '💧' },
        ];

        const pl = document.getElementById('productListCustom');
        if (pl) {
            products.forEach((p, i) => {
                const row = document.createElement('div');
                row.className = 'product-row';
                row.style.animationDelay = (i * 0.1) + 's';
                row.innerHTML = `
                    <span class="p-rank">${i + 1}</span>
                    <div class="p-icon" style="background:${p.color}18;">${p.icon}</div>
                    <div class="p-info">
                        <div class="p-name">${p.name}</div>
                        <div class="p-cat">${p.cat}</div>
                    </div>
                    <div class="p-bar-wrap">
                        <div class="p-bar" style="width: 0%; background: ${p.color};" data-w="${p.pct}"></div>
                    </div>
                    <div class="p-rev">${p.rev}</div>
                `;
                pl.appendChild(row);
            });
        }

        const funnelSteps = [
            { label: 'الزوار', pct: 100, color: '#2dbe60' },
            { label: 'مشاهدة منتج', pct: 57, color: '#4cad72' },
            { label: 'إضافة للسلة', pct: 25, color: '#efb840' },
            { label: 'الدفع', pct: 12, color: '#f09060' },
            { label: 'الشراء', pct: 7, color: '#e05a5a' },
        ];
        const fn = document.getElementById('funnelCustom');
        if (fn) {
            funnelSteps.forEach(s => {
                const row = document.createElement('div');
                row.className = 'funnel-row';
                row.innerHTML = `
                    <span class="f-label">${s.label}</span>
                    <div class="f-outer">
                        <div class="f-inner" style="width: 0%; background: ${s.color};" data-w="${s.pct}"></div>
                    </div>
                    <span class="f-pct">${s.pct}%</span>
                `;
                fn.appendChild(row);
            });
        }

        const orders = [
            { id: '#4821', name: 'أحمد ازيان', st: 'st-delivered', sl: 'تم التوصيل', total: '135.00 درهم' },
            { id: '#4820', name: 'سارة الإدريسي', st: 'st-shipped', sl: 'شُحن', total: '90.00 درهم' },
            { id: '#4819', name: 'يوسف بنعلي', st: 'st-processing', sl: 'معالجة', total: '190.00 درهم' },
            { id: '#4818', name: 'نادية الحسني', st: 'st-delivered', sl: 'تم التوصيل', total: '235.00 درهم' },
            { id: '#4817', name: 'كريم الطاهر', st: 'st-shipped', sl: 'شُحن', total: '270.00 درهم' },
        ];
        const ob = document.getElementById('orderBodyCustom');
        if (ob) {
            orders.forEach(o => {
                const tr = document.createElement('tr');
                tr.className = 'order-row-premium';
                tr.innerHTML = `
                    <td style="font-family:'DM Mono',monospace; font-size: 0.8rem; color: rgba(255,255,255,0.3);">${o.id}</td>
                    <td class="fw-bold">${o.name}</td>
                    <td><span class="status-custom ${o.st}">${o.sl}</span></td>
                    <td class="fw-bold">${o.total}</td>
                `;
                ob.appendChild(tr);
            });
        }

        // --- 6. Animate bars after delay ---
        setTimeout(() => {
            document.querySelectorAll('.p-bar').forEach(b => { b.style.width = b.dataset.w + '%'; });
            document.querySelectorAll('.f-inner').forEach(b => { b.style.width = b.dataset.w + '%'; });
        }, 500);
    }


    function initHeroCarousel() {
        const track = document.getElementById('track');
        if (!track) return;

        const pnDisplay = document.getElementById('pnDisplay');
        const dotsEl = document.getElementById('dots');
        const cur = document.getElementById('cur');
        const curArrow = document.getElementById('curArrow');

        const plants = [
            { name: 'مونستيرا ديليسيوسا', price: 'ابتداءً من 120 درهم', tag: 'الأكثر مبيعاً', color: '#3d7a35', svg: `<svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="95" rx="18" ry="8" fill="#1a3d1a" opacity=".6"/><rect x="36" y="60" width="8" height="36" rx="4" fill="#2d5e28"/><path d="M40 62 C30 50 10 48 8 30 C6 15 20 8 32 18 C36 22 38 30 40 40" fill="#4a9e40" opacity=".9"/><path d="M40 62 C50 50 70 48 72 30 C74 15 60 8 48 18 C44 22 42 30 40 40" fill="#5ab84a" opacity=".85"/><path d="M32 18 C28 22 24 28 26 36" stroke="#3d7a35" stroke-width="1.5" stroke-linecap="round"/><path d="M48 18 C52 22 56 28 54 36" stroke="#4a9e40" stroke-width="1.5" stroke-linecap="round"/><circle cx="22" cy="32" r="2" fill="#1a3d1a" opacity=".5"/><circle cx="58" cy="32" r="2" fill="#2d5e28" opacity=".5"/></svg>` },
            { name: 'بوتس ذهبي', price: 'ابتداءً من 80 درهم', tag: 'سهل العناية', color: '#6a8c30', svg: `<svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="95" rx="16" ry="7" fill="#1a3d1a" opacity=".5"/><rect x="37" y="65" width="6" height="30" rx="3" fill="#2d5e28"/><path d="M40 68 Q25 55 15 40 Q10 30 18 22 Q26 15 34 28 Q38 38 40 52" fill="#7ab830" opacity=".9"/><path d="M34 28 Q30 32 28 40" stroke="#5a8a20" stroke-width="1.2" stroke-linecap="round"/><path d="M40 68 Q55 55 65 40 Q70 30 62 22 Q54 15 46 28 Q42 38 40 52" fill="#9ed840" opacity=".8"/><path d="M46 28 Q50 32 52 40" stroke="#7ab830" stroke-width="1.2" stroke-linecap="round"/><path d="M40 52 Q32 62 28 70" stroke="#5a8a20" stroke-width="1" stroke-linecap="round" opacity=".6"/><path d="M40 52 Q48 62 52 70" stroke="#7ab830" stroke-width="1" stroke-linecap="round" opacity=".6"/></svg>` },
            { name: 'صبار صحراوي', price: 'ابتداءً من 50 درهم', tag: 'يتحمل الجفاف', color: '#5a8040', svg: `<svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="97" rx="20" ry="8" fill="#1a3d1a" opacity=".5"/><rect x="28" y="45" width="24" height="52" rx="12" fill="#4a7a3a"/><rect x="28" y="45" width="24" height="52" rx="12" fill="url(#cgrad)"/><defs><linearGradient id="cgrad" x1="28" y1="45" x2="52" y2="97" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5a9e4a"/><stop offset="1" stop-color="#3a6a2a"/></linearGradient></defs><rect x="10" y="55" width="20" height="14" rx="7" fill="#4a8a3a" opacity=".9"/><rect x="50" y="62" width="20" height="14" rx="7" fill="#3a7a2a" opacity=".9"/><line x1="32" y1="50" x2="32" y2="95" stroke="#3a6a2a" stroke-width=".8" opacity=".4"/><line x1="36" y1="48" x2="36" y2="96" stroke="#3a6a2a" stroke-width=".8" opacity=".3"/><line x1="40" y1="46" x2="40" y2="97" stroke="#3a6a2a" stroke-width=".8" opacity=".4"/><line x1="44" y1="48" x2="44" y2="96" stroke="#3a6a2a" stroke-width=".8" opacity=".3"/><line x1="48" y1="50" x2="48" y2="95" stroke="#3a6a2a" stroke-width=".8" opacity=".4"/><circle cx="40" cy="43" r="4" fill="#c8e870" opacity=".9"/><circle cx="40" cy="38" r="3" fill="#e0f890" opacity=".8"/></svg>` },
            { name: 'فيكوس شجرة', price: 'ابتداءً من 180 درهم', tag: 'نادر ومميز', color: '#2d6e40', svg: `<svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="97" rx="14" ry="6" fill="#1a3d1a" opacity=".6"/><rect x="37" y="60" width="6" height="37" rx="3" fill="#3d2a1a"/><rect x="34" y="72" width="5" height="18" rx="2.5" fill="#4a3520" transform="rotate(-20 34 72)"/><rect x="41" y="68" width="5" height="16" rx="2.5" fill="#3d2a1a" transform="rotate(15 41 68)"/><ellipse cx="40" cy="38" rx="26" ry="26" fill="#2d6e40" opacity=".95"/><ellipse cx="32" cy="32" rx="18" ry="18" fill="#3d8a50" opacity=".8"/><ellipse cx="46" cy="42" rx="16" ry="16" fill="#4aaa5a" opacity=".7"/><ellipse cx="38" cy="28" rx="14" ry="14" fill="#5ab860" opacity=".7"/><circle cx="44" cy="30" r="3" fill="#7ad870" opacity=".5"/><circle cx="34" cy="44" r="2" fill="#5aaa50" opacity=".5"/></svg>` },
            { name: 'لافندر عطري', price: 'ابتداءً من 65 درهم', tag: 'عطري ومريح', color: '#6a5a8c', svg: `<svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="97" rx="15" ry="6" fill="#1a3d1a" opacity=".5"/><rect x="37" y="65" width="6" height="32" rx="3" fill="#3a5a20"/><rect x="30" y="58" width="4" height="22" rx="2" fill="#3a5a20" transform="rotate(-12 30 58)"/><rect x="46" y="56" width="4" height="22" rx="2" fill="#3a5a20" transform="rotate(12 46 56)"/><ellipse cx="40" cy="52" rx="6" ry="16" fill="#8060b0" opacity=".9"/><ellipse cx="30" cy="46" rx="5" ry="14" fill="#7050a8" opacity=".85" transform="rotate(-12 30 46)"/><ellipse cx="50" cy="44" rx="5" ry="14" fill="#9070c0" opacity=".8" transform="rotate(12 50 44)"/><circle cx="40" cy="36" r="3" fill="#c0a0e0" opacity=".7"/><circle cx="30" cy="32" r="2.5" fill="#b090d8" opacity=".6"/><circle cx="50" cy="30" r="2.5" fill="#c8a8e8" opacity=".6"/></svg>` }
        ];

        let active = 0;
        let isAnimating = false;

        function buildNameDisplay() {
            pnDisplay.innerHTML = '';
            plants.forEach((p, i) => {
                const d = document.createElement('div');
                d.className = 'pname' + (i === 0 ? ' active' : '');
                d.id = 'pn' + i;
                d.innerHTML = p.name + '<span class="pname-price">' + p.price + '</span>';
                pnDisplay.appendChild(d);
            });
        }

        function buildDots() {
            dotsEl.innerHTML = '';
            plants.forEach((_, i) => {
                const d = document.createElement('div');
                d.className = 'dot' + (i === 0 ? ' on' : '');
                d.onclick = () => goTo(i);
                dotsEl.appendChild(d);
            });
        }

        function getCardStyles(idx, total, activeIdx) {
            const positions = [];
            const n = total;
            for (let i = 0; i < n; i++) {
                const offset = (i - activeIdx + n) % n;
                const d = offset > n / 2 ? offset - n : offset;
                positions.push(d);
            }
            const d = positions[idx];
            const abs = Math.abs(d);
            
            // Dynamic track scaling
            const trackW = track.offsetWidth || 900;
            const cx = trackW / 2;
            
            // Responsive card sizing
            const isMobile = window.innerWidth <= 991;
            const cardW = isMobile ? 140 : 180;
            const spread = isMobile ? (cardW * 0.65) : (cardW * 0.85);
            
            const x = cx - d * spread - cardW / 2;
            const z = -abs * (isMobile ? 80 : 120);
            const scale = 1 - abs * 0.12;
            const opacity = abs > 2 ? 0 : 1 - abs * 0.18;
            const rotY = d * 15;
            const y = abs * (isMobile ? 12 : 20);
            const zIdx = 10 - abs;
            
            return { x, z, scale, opacity, rotY, y, zIdx, d };
        }

        function renderCards() {
            const existing = track.querySelectorAll('.card-3d');
            existing.forEach(c => c.remove());
            plants.forEach((p, i) => {
                const s = getCardStyles(i, plants.length, active);
                if (Math.abs(s.d) > 2) return;
                const c = document.createElement('div');
                c.className = 'card-3d';
                c.style.cssText = `
              left:${s.x}px;top:${50 + s.y}px;
              transform:perspective(900px) rotateY(${s.rotY}deg) scale(${s.scale}) translateZ(${s.z}px);
              opacity:${s.opacity};
              z-index:${s.zIdx};
            `;
                c.innerHTML = `
              <div class="card-inner">
                <div class="card-plant-svg">${p.svg}</div>
                <div class="card-glow"></div>
                <div class="card-tag">${p.tag}</div>
              </div>
            `;
                c.addEventListener('click', () => goTo(i));
                track.appendChild(c);
            });
        }

        let nameTimeout;
        function updateName(idx) {
            pnDisplay.querySelectorAll('.pname').forEach(n => {
                if (n.id === 'pn' + idx) return;
                if (n.classList.contains('active')) {
                    n.classList.remove('active');
                    n.classList.add('exit-up');
                    setTimeout(() => n.classList.remove('exit-up'), 500);
                }
            });
            clearTimeout(nameTimeout);
            const nextEl = document.getElementById('pn' + idx);
            if (nextEl) {
                nextEl.classList.remove('exit-up');
                nameTimeout = setTimeout(() => { nextEl.classList.add('active') }, 50);
            }
        }

        function goTo(idx) {
            if (isAnimating || idx === active) return;
            isAnimating = true;
            updateName(idx);
            active = idx;
            renderCards();
            const dots = dotsEl.querySelectorAll('.dot');
            if (dots.length) {
                dots.forEach((d, i) => d.classList.toggle('on', i === idx));
            }
            setTimeout(() => isAnimating = false, 650);
        }

        function next() { goTo((active + 1) % plants.length) }
        function prev() { goTo((active - 1 + plants.length) % plants.length) }

        track.addEventListener('mousemove', e => {
            const r = track.getBoundingClientRect();
            const mx = e.clientX - r.left;
            const my = e.clientY - r.top;
            cur.style.opacity = '1';
            cur.style.left = (mx - 24) + 'px';
            cur.style.top = (my - 24) + 'px';
            curArrow.textContent = mx < r.width / 2 ? '‹' : '›';
        });
        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => {
            cur.style.opacity = '0';
            updateName(active);
            clearInterval(autoPlay);
            autoPlay = setInterval(() => { if (document.visibilityState === 'visible') next() }, 3800);
        });
        track.addEventListener('click', e => {
            const r = track.getBoundingClientRect();
            if (e.clientX - r.left < r.width / 2) next(); else prev();
        });

        let startX = 0;
        track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            clearInterval(autoPlay);
        }, { passive: true });
        track.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) { dx > 0 ? next() : prev() }
            clearInterval(autoPlay);
            autoPlay = setInterval(() => { if (document.visibilityState === 'visible') next() }, 3800);
        }, { passive: true });

        buildNameDisplay();
        buildDots();
        renderCards();

        window.addEventListener('resize', renderCards);
        
        let autoPlay = setInterval(() => { if (document.visibilityState === 'visible') next() }, 3800);
    }

})(jQuery);

