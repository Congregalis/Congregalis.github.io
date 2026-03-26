// ========== Theme Management with Smooth Transition ==========
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check saved theme or prefer dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    html.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    const currentTheme = html.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 500);
});

// ========== Animated Nebula Background for Dark Mode - Mysterious & Chaotic Version ==========
function createNebula() {
    const canvas = document.getElementById('nebula-canvas');
    const ctx = canvas.getContext('2d');
    const starfield = document.getElementById('starfield');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create static stars - varying sizes for more depth
    const numberOfStars = 200;
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.opacity = Math.random() * 0.6 + 0.2;
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
    
    // Nebula clouds - more particles, smaller size, chaotic movement
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
            // Mix of deep blues, purples for mysterious vibe
            this.hue = 200 + Math.random() * 80; // 200=blue -> 280=purple
            this.saturation = 40 + Math.random() * 30;
            this.lightness = 15 + Math.random() * 20;
            this.opacity = Math.random() * 0.08 + 0.02; // Very low opacity for subtlety
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.002 + Math.random() * 0.003;
        }
        
        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            
            // Gentle pulsing for chaotic feel
            this.pulsePhase += this.pulseSpeed;
            this.size = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.1);
            
            // Wrap around edges
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
            
            // Create irregular cloud shape with multiple overlapping gradients
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
            
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Add a second irregular blob for chaotic structure
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
    
    for (let i = 0; i < cloudCount; i++) {
        clouds.push(new Cloud());
    }
    
    // Add larger amorphous background blobs for deeper chaos
    const blobs = [];
    for (let i = 0; i < 8; i++) {
        blobs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 400 + Math.random() * 600,
            hue: 220 + Math.random() * 60,
            speed: (Math.random() * 0.04 - 0.02) * 0.1
        });
    }
    
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Near-black background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, 'rgba(5, 8, 15, 1)');
        bgGradient.addColorStop(1, 'rgba(0, 2, 5, 1)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw large background blobs first
        blobs.forEach(blob => {
            blob.x += blob.speed;
            blob.y += blob.speed * 0.5;
            if (blob.x < -blob.size) blob.x = canvas.width + blob.size;
            if (blob.y < -blob.size) blob.y = canvas.height + blob.size;
            if (blob.x > canvas.width + blob.size) blob.x = -blob.size;
            if (blob.y > canvas.height + blob.size) blob.y = -blob.size;
            
            const blobGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.size);
            blobGrad.addColorStop(0, `hsla(${blob.hue}, 20%, 20%, 0.04)`);
            blobGrad.addColorStop(1, `hsla(${blob.hue}, 20%, 20%, 0)`);
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
            ctx.fillStyle = blobGrad;
            ctx.fill();
        });
        
        // Draw all nebula clouds
        clouds.forEach(cloud => {
            cloud.update(time);
            cloud.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

createNebula();

// ========== Typewriter Effect ==========
function typeWriter() {
    const textArray = ['探索世界', '记录思考', '创造乐趣', '开发 AI Agents'];
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typedTextSpan = document.querySelector('.typed-text');
    
    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, pauseTime);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
        }
    }
    
    setTimeout(type, 1000);
}

// Add blink animation CSS
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// Start typewriter after page loads
window.addEventListener('load', typeWriter);

// ========== Parallax Scroll Effect ==========
function parallaxEffect() {
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        if (heroContent) {
            heroContent.style.transform = `translateY(${parallax}px)`;
        }
    });
}

parallaxEffect();

// ========== Mobile Menu ==========
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ========== Lightbox Gallery ==========
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCounter = document.getElementById('lightbox-current');
const lightboxTotal = document.getElementById('lightbox-total');
const lightboxTitle = document.getElementById('lightbox-title');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentIndex = 0;
const galleryData = [];

// Parse gallery data
galleryItems.forEach((item, index) => {
    const type = item.getAttribute('data-type') || 'image';
    const src = item.getAttribute('data-src');
    const title = item.querySelector('.gallery-overlay span')?.textContent || '';
    const poster = item.querySelector('img')?.src || '';
    
    galleryData.push({
        index,
        type,
        src,
        title,
        poster
    });
    
    // Add click handler
    item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
    });
});

// Update total counter
lightboxTotal.textContent = galleryData.length;

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Stop video if playing
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
}

function updateLightboxContent() {
    const item = galleryData[currentIndex];
    
    // Update counter
    lightboxCounter.textContent = currentIndex + 1;
    
    // Update title
    lightboxTitle.textContent = item.title;
    
    // Show/hide navigation buttons based on position
    lightboxPrev.style.opacity = currentIndex > 0 ? '1' : '0.3';
    lightboxPrev.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
    lightboxNext.style.opacity = currentIndex < galleryData.length - 1 ? '1' : '0.3';
    lightboxNext.style.pointerEvents = currentIndex < galleryData.length - 1 ? 'auto' : 'none';
    
    // Handle media type
    if (item.type === 'video') {
        // Show video, hide image
        lightboxImage.classList.remove('active');
        lightboxVideo.classList.add('active');
        
        // Set video source and poster
        lightboxVideo.querySelector('source').src = item.src;
        lightboxVideo.poster = item.poster;
        lightboxVideo.load();
    } else {
        // Show image, hide video
        lightboxVideo.classList.remove('active');
        lightboxVideo.pause();
        lightboxImage.classList.add('active');
        
        // Set image source
        lightboxImage.src = item.src;
        lightboxImage.alt = item.title;
    }
}

function showPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        updateLightboxContent();
    }
}

function showNext() {
    if (currentIndex < galleryData.length - 1) {
        currentIndex++;
        updateLightboxContent();
    }
}

// Event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Close on overlay click
lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrev();
            break;
        case 'ArrowRight':
            showNext();
            break;
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.querySelector('.lightbox-container').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.querySelector('.lightbox-container').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            showNext(); // Swipe left, go next
        } else {
            showPrev(); // Swipe right, go previous
        }
    }
}

// ========== Smooth Scroll for Navigation Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== Navbar Background on Scroll ==========
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========== Intersection Observer for Fade-in Animation ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.writing-card, .gallery-item, .project-item, .anime-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========== Flashlight Effect for Dark Mode ==========
function createFlashlightEffect() {
    const flashlightCanvas = document.getElementById('flashlight-canvas');
    const ctx = flashlightCanvas.getContext('2d');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    
    // Flashlight radius
    const flashlightRadius = 220;
    
    function resizeCanvas() {
        flashlightCanvas.width = window.innerWidth;
        flashlightCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation for flashlight position
    function animate() {
        // Linear interpolation for smooth following
        const lerpFactor = 0.15;
        currentX += (mouseX - currentX) * lerpFactor;
        currentY += (mouseY - currentY) * lerpFactor;
        
        // Clear the canvas
        ctx.clearRect(0, 0, flashlightCanvas.width, flashlightCanvas.height);
        
        // Check if we're in dark mode
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkMode) {
            // Create a full black overlay with a transparent circle at mouse position
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, flashlightCanvas.width, flashlightCanvas.height);
            
            // Use destination-out to cut out the flashlight circle
            ctx.globalCompositeOperation = 'destination-out';
            
            // Create gradient for soft edge of flashlight
            const gradient = ctx.createRadialGradient(
                currentX, currentY, 0,
                currentX, currentY, flashlightRadius
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(currentX, currentY, flashlightRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Reset composite operation
            ctx.globalCompositeOperation = 'source-over';
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

createFlashlightEffect();

// ========== Sunlight Dust Effect for Light Mode ==========
function createSunlightDustEffect() {
    const canvas = document.getElementById('sunlight-canvas');
    const ctx = canvas.getContext('2d');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    
    // Sunlight halo radius
    const haloRadius = 280;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Create dust particles
    const particles = [];
    const particleCount = 60;
    
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
            
            // Wrap around edges
            if (this.x < -10) this.x = window.innerWidth + 10;
            if (this.x > window.innerWidth + 10) this.x = -10;
            if (this.y < -10) this.y = window.innerHeight + 10;
            if (this.y > window.innerHeight + 10) this.y = -10;
        }
        
        draw(ctx, centerX, centerY, radius) {
            // Calculate distance from mouse
            const dx = this.x - centerX;
            const dy = this.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only show particles within halo radius with fade at edges
            if (distance < radius) {
                const fadeFactor = 1 - (distance / radius);
                const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
                const alpha = this.opacity * fadeFactor * twinkle;
                
                // Golden color for dust particles
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 140, ${alpha})`;
                ctx.fill();
            }
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new DustParticle());
    }
    
    // Smooth animation for sunlight halo position
    function animate() {
        // Linear interpolation for smooth following
        const lerpFactor = 0.12;
        currentX += (mouseX - currentX) * lerpFactor;
        currentY += (mouseY - currentY) * lerpFactor;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Check if we're in light mode
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        if (isLightMode) {
            // Draw soft golden halo around mouse - Enhanced visibility
            const haloGradient = ctx.createRadialGradient(
                currentX, currentY, 0,
                currentX, currentY, haloRadius
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
            
            // Update and draw dust particles
            particles.forEach(particle => {
                particle.update();
                particle.draw(ctx, currentX, currentY, haloRadius);
            });
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

createSunlightDustEffect();

console.log('Congregalis • Personal Website');
console.log('Created with DeerFlow');

