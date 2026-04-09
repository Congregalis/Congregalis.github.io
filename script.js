const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const writingGrid = document.getElementById('writing-grid');
const galleryGrid = document.getElementById('gallery-grid');
const writingStatus = document.getElementById('writing-status');
const galleryStatus = document.getElementById('gallery-status');

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCounter = document.getElementById('lightbox-current');
const lightboxTotal = document.getElementById('lightbox-total');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxOverlay = lightbox?.querySelector('.lightbox-overlay') || null;
const lightboxContainer = lightbox?.querySelector('.lightbox-container') || null;

let galleryData = [];
let currentIndex = 0;

const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    })
    : null;

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case '\'':
                return '&#39;';
            default:
                return char;
        }
    });
}

function formatDateDisplay(value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return escapeHtml(value);
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

function showStatus(element, message, isError = false) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.remove('is-hidden');
    element.classList.toggle('is-error', isError);
}

function hideStatus(element) {
    if (!element) {
        return;
    }

    element.textContent = '';
    element.classList.remove('is-error');
    element.classList.add('is-hidden');
}

function observeCards(elements) {
    Array.from(elements).forEach((element) => {
        if (!(element instanceof HTMLElement) || element.dataset.revealReady === 'true') {
            return;
        }

        element.dataset.revealReady = 'true';

        if (!revealObserver) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            return;
        }

        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
}

function getStoredTheme() {
    try {
        return localStorage.getItem('theme');
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch {
        // Ignore storage write failures.
    }
}

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }
}

function initializeTheme() {
    const savedTheme = getStoredTheme();
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const nextTheme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';

    applyTheme(nextTheme);

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const updatedTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(updatedTheme);
        saveTheme(updatedTheme);

        window.setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 500);
    });
}

function createNebula() {
    const canvas = document.getElementById('nebula-canvas');
    const starfield = document.getElementById('starfield');

    if (!canvas || !starfield) {
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const numberOfStars = 200;
    for (let index = 0; index < numberOfStars; index += 1) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.opacity = String(Math.random() * 0.6 + 0.2);

        const size = Math.random();
        if (size > 0.85) {
            star.style.width = '3px';
            star.style.height = '3px';
        } else if (size > 0.6) {
            star.style.width = '2px';
            star.style.height = '2px';
        }

        starfield.appendChild(star);
    }

    const clouds = [];
    const cloudCount = 80;

    class Cloud {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 150 + 50;
            this.size = this.baseSize;
            this.speedX = (Math.random() * 0.15 - 0.075) * 0.5;
            this.speedY = (Math.random() * 0.15 - 0.075) * 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.02 - 0.01) * 0.5;
            this.hue = 200 + Math.random() * 80;
            this.saturation = 40 + Math.random() * 30;
            this.lightness = 15 + Math.random() * 20;
            this.opacity = Math.random() * 0.08 + 0.02;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.002 + Math.random() * 0.003;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.pulsePhase += this.pulseSpeed;
            this.size = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.1);

            const padding = this.size;
            if (this.x < -padding) this.x = canvas.width + padding;
            if (this.x > canvas.width + padding) this.x = -padding;
            if (this.y < -padding) this.y = canvas.height + padding;
            if (this.y > canvas.height + padding) this.y = -padding;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);

            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.translate(this.size * 0.3, -this.size * 0.2);
            const gradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.6);
            const hueShift = this.hue + Math.random() * 20 - 10;
            gradient2.addColorStop(0, `hsla(${hueShift}, ${this.saturation}%, ${this.lightness + 5}%, ${this.opacity * 0.8})`);
            gradient2.addColorStop(1, `hsla(${hueShift}, ${this.saturation}%, ${this.lightness + 5}%, 0)`);

            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = gradient2;
            ctx.fill();

            ctx.restore();
        }
    }

    for (let index = 0; index < cloudCount; index += 1) {
        clouds.push(new Cloud());
    }

    const blobs = Array.from({ length: 8 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 400 + Math.random() * 600,
        hue: 220 + Math.random() * 60,
        speed: (Math.random() * 0.04 - 0.02) * 0.1
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, 'rgba(5, 8, 15, 1)');
        bgGradient.addColorStop(1, 'rgba(0, 2, 5, 1)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        blobs.forEach((blob) => {
            blob.x += blob.speed;
            blob.y += blob.speed * 0.5;
            if (blob.x < -blob.size) blob.x = canvas.width + blob.size;
            if (blob.y < -blob.size) blob.y = canvas.height + blob.size;
            if (blob.x > canvas.width + blob.size) blob.x = -blob.size;
            if (blob.y > canvas.height + blob.size) blob.y = -blob.size;

            const blobGradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.size);
            blobGradient.addColorStop(0, `hsla(${blob.hue}, 20%, 20%, 0.04)`);
            blobGradient.addColorStop(1, `hsla(${blob.hue}, 20%, 20%, 0)`);
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
            ctx.fillStyle = blobGradient;
            ctx.fill();
        });

        clouds.forEach((cloud) => {
            cloud.update();
            cloud.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function initializeTypewriter() {
    const typedTextSpan = document.querySelector('.typed-text');
    if (!typedTextSpan) {
        return;
    }

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor-blink {
            animation: blink 1s infinite;
            border-left: 2px solid var(--accent-color);
            padding-left: 2px;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(cursorStyle);

    const textArray = ['探索', '思考', '记录', '创造'];
    const typingSpeed = 75;
    const deletingSpeed = 50;
    const pauseTime = 1000;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex -= 1;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex += 1;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            window.setTimeout(type, pauseTime);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            window.setTimeout(type, 500);
            return;
        }

        window.setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }

    window.addEventListener('load', () => {
        window.setTimeout(type, 1000);
    });
}

function initializeParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) {
        return;
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function onAnchorClick(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            const offsetTop = targetElement.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

function initializeNavbarShadow() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }

    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 100
            ? '0 2px 10px rgba(0, 0, 0, 0.1)'
            : 'none';
    });
}

function createFlashlightEffect() {
    const flashlightCanvas = document.getElementById('flashlight-canvas');
    if (!flashlightCanvas) {
        return;
    }

    const ctx = flashlightCanvas.getContext('2d');
    if (!ctx) {
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    const flashlightRadius = 220;

    function resizeCanvas() {
        flashlightCanvas.width = window.innerWidth;
        flashlightCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;

        ctx.clearRect(0, 0, flashlightCanvas.width, flashlightCanvas.height);

        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, flashlightCanvas.width, flashlightCanvas.height);

            ctx.globalCompositeOperation = 'destination-out';

            const gradient = ctx.createRadialGradient(
                currentX,
                currentY,
                0,
                currentX,
                currentY,
                flashlightRadius
            );

            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(currentX, currentY, flashlightRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.globalCompositeOperation = 'source-over';
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function createSunlightDustEffect() {
    const canvas = document.getElementById('sunlight-canvas');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    const haloRadius = 280;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    class DustParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.015 + Math.random() * 0.025;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.twinklePhase += this.twinkleSpeed;

            if (this.x < -10) this.x = window.innerWidth + 10;
            if (this.x > window.innerWidth + 10) this.x = -10;
            if (this.y < -10) this.y = window.innerHeight + 10;
            if (this.y > window.innerHeight + 10) this.y = -10;
        }

        draw(centerX, centerY, radius) {
            const dx = this.x - centerX;
            const dy = this.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance >= radius) {
                return;
            }

            const fadeFactor = 1 - distance / radius;
            const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
            const alpha = this.opacity * fadeFactor * twinkle;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 140, ${alpha})`;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 60 }, () => new DustParticle());

    function animate() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (document.documentElement.getAttribute('data-theme') === 'light') {
            const haloGradient = ctx.createRadialGradient(
                currentX,
                currentY,
                0,
                currentX,
                currentY,
                haloRadius
            );

            haloGradient.addColorStop(0, 'rgba(255, 220, 150, 0.35)');
            haloGradient.addColorStop(0.3, 'rgba(255, 215, 140, 0.22)');
            haloGradient.addColorStop(0.5, 'rgba(255, 210, 130, 0.12)');
            haloGradient.addColorStop(0.7, 'rgba(255, 205, 125, 0.06)');
            haloGradient.addColorStop(1, 'rgba(255, 200, 120, 0)');

            ctx.beginPath();
            ctx.arc(currentX, currentY, haloRadius, 0, Math.PI * 2);
            ctx.fillStyle = haloGradient;
            ctx.fill();

            particles.forEach((particle) => {
                particle.update();
                particle.draw(currentX, currentY, haloRadius);
            });
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function normalizeWriting(item, index) {
    return {
        title: String(item?.title || `未命名随笔 ${index + 1}`).trim(),
        excerpt: String(item?.excerpt || '这篇随笔还没写摘要。').trim(),
        date: String(item?.date || '').trim(),
        href: String(item?.href || '#').trim()
    };
}

function normalizeGalleryItem(item, index) {
    const title = String(item?.title || `未命名影集 ${index + 1}`).trim();
    const type = item?.type === 'video' ? 'video' : 'image';
    const src = String(item?.src || '').trim();
    const thumb = String(item?.thumb || src).trim();
    const poster = String(item?.poster || thumb).trim();
    const alt = String(item?.alt || title).trim();

    return {
        title,
        type,
        src,
        thumb,
        poster,
        alt
    };
}

async function loadSiteData() {
    if (window.__SITE_DATA__?.writings && window.__SITE_DATA__?.gallery) {
        return window.__SITE_DATA__;
    }

    const [writingsResponse, galleryResponse] = await Promise.all([
        fetch('./data/writings.json', { cache: 'no-store' }),
        fetch('./data/gallery.json', { cache: 'no-store' })
    ]);

    if (!writingsResponse.ok || !galleryResponse.ok) {
        throw new Error('站点数据未构建完成，请先运行 npm run build:content。');
    }

    return {
        writings: await writingsResponse.json(),
        gallery: await galleryResponse.json()
    };
}

function renderWritings(writings) {
    if (!writingGrid) {
        return [];
    }

    if (writings.length === 0) {
        writingGrid.innerHTML = '';
        showStatus(writingStatus, '暂时还没有随笔。');
        return [];
    }

    writingGrid.innerHTML = writings.map((item) => `
        <article class="writing-card">
            <div class="writing-date">${escapeHtml(formatDateDisplay(item.date))}</div>
            <h3 class="writing-title">${escapeHtml(item.title)}</h3>
            <p class="writing-excerpt">${escapeHtml(item.excerpt)}</p>
            <a href="${escapeHtml(item.href)}" class="reading-more">Read more →</a>
        </article>
    `).join('');

    hideStatus(writingStatus);
    return Array.from(writingGrid.querySelectorAll('.writing-card'));
}

function renderGallery(items) {
    if (!galleryGrid) {
        return [];
    }

    if (items.length === 0) {
        galleryGrid.innerHTML = '';
        showStatus(galleryStatus, '暂时还没有影集内容。');
        return [];
    }

    galleryGrid.innerHTML = items.map((item) => `
        <div class="gallery-item" data-type="${escapeHtml(item.type)}" role="button" tabindex="0" aria-label="${escapeHtml(item.title)}">
            <img src="${escapeHtml(item.thumb)}" alt="${escapeHtml(item.alt)}" loading="lazy">
            <div class="gallery-overlay ${item.type === 'video' ? 'video-overlay' : ''}">
                ${item.type === 'video' ? '<i class="fas fa-play-circle"></i>' : ''}
                <span>${escapeHtml(item.title)}</span>
            </div>
        </div>
    `).join('');

    hideStatus(galleryStatus);
    return Array.from(galleryGrid.querySelectorAll('.gallery-item'));
}

function updateLightboxContent() {
    const item = galleryData[currentIndex];
    if (!item || !lightbox || !lightboxImage || !lightboxVideo || !lightboxCounter || !lightboxTitle || !lightboxPrev || !lightboxNext) {
        return;
    }

    lightboxCounter.textContent = String(currentIndex + 1);
    lightboxTitle.textContent = item.title;

    lightboxPrev.style.opacity = currentIndex > 0 ? '1' : '0.3';
    lightboxPrev.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
    lightboxNext.style.opacity = currentIndex < galleryData.length - 1 ? '1' : '0.3';
    lightboxNext.style.pointerEvents = currentIndex < galleryData.length - 1 ? 'auto' : 'none';

    if (item.type === 'video') {
        const source = lightboxVideo.querySelector('source');
        if (source) {
            source.src = item.src;
        }

        lightboxImage.classList.remove('active');
        lightboxVideo.classList.add('active');
        lightboxVideo.poster = item.poster;
        lightboxVideo.load();
        return;
    }

    lightboxVideo.classList.remove('active');
    lightboxVideo.pause();
    lightboxImage.classList.add('active');
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title;
}

function openLightbox(index) {
    if (!lightbox || galleryData.length === 0) {
        return;
    }

    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox || !lightboxVideo || !lightboxImage) {
        return;
    }

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightboxVideo.classList.remove('active');
    lightboxImage.classList.remove('active');
}

function showPrev() {
    if (currentIndex > 0) {
        currentIndex -= 1;
        updateLightboxContent();
    }
}

function showNext() {
    if (currentIndex < galleryData.length - 1) {
        currentIndex += 1;
        updateLightboxContent();
    }
}

function initializeLightbox(items) {
    galleryData = items;

    if (lightboxTotal) {
        lightboxTotal.textContent = String(galleryData.length);
    }

    if (!galleryGrid) {
        return;
    }

    Array.from(galleryGrid.querySelectorAll('.gallery-item')).forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (!lightbox || lightbox.dataset.bound === 'true') {
        return;
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', showPrev);
    lightboxNext?.addEventListener('click', showNext);
    lightboxOverlay?.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('active')) {
            return;
        }

        switch (event.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
            default:
                break;
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightboxContainer?.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    lightboxContainer?.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) <= swipeThreshold) {
            return;
        }

        if (diff > 0) {
            showNext();
            return;
        }

        showPrev();
    }, { passive: true });

    lightbox.dataset.bound = 'true';
}

async function initializeContent() {
    if (!writingGrid && !galleryGrid) {
        return;
    }

    try {
        const siteData = await loadSiteData();
        const writings = Array.isArray(siteData.writings)
            ? siteData.writings.map(normalizeWriting)
            : [];
        const galleryItems = Array.isArray(siteData.gallery)
            ? siteData.gallery.map(normalizeGalleryItem)
            : [];

        const revealedElements = [
            ...renderWritings(writings),
            ...renderGallery(galleryItems)
        ];

        initializeLightbox(galleryItems);
        observeCards(revealedElements);
    } catch (error) {
        console.error('加载站点内容失败', error);
        showStatus(writingStatus, '随笔加载失败，请先运行 npm run build:content。', true);
        showStatus(galleryStatus, '影集加载失败，请先运行 npm run build:content。', true);
    }
}

initializeTheme();
createNebula();
initializeTypewriter();
initializeParallax();
initializeMobileMenu();
initializeSmoothScroll();
initializeNavbarShadow();
observeCards(document.querySelectorAll('.project-item, .anime-card'));
createFlashlightEffect();
createSunlightDustEffect();
void initializeContent();

console.log('Congregalis • Personal Website');
console.log('Created with DeerFlow');
