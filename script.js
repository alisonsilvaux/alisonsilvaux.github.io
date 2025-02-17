document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.nav-group a');
    const sections = document.querySelectorAll('section[id]');
    
    // Configuração do Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px',  // Considera ativo quando a seção estiver no meio da tela
        threshold: 0
    };

    function updateActiveMenu(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active de todos os links
                menuItems.forEach(item => item.classList.remove('active'));
                
                // Adiciona active ao link correspondente à seção atual
                const activeId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-group a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Cria o observer
    const observer = new IntersectionObserver(updateActiveMenu, observerOptions);

    // Observa todas as seções
    sections.forEach(section => observer.observe(section));

    // Click handler para scroll suave
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Configuração do tilt
    const tiltConfig = {
        max: 5,
        speed: 800,
        glare: true,
        "max-glare": 0.1,
        scale: 1.01,
        perspective: 2000,
        transition: true,
        gyroscope: true,
        gyroscopeMinAngleX: -5,
        gyroscopeMaxAngleX: 5,
        gyroscopeMinAngleY: -5,
        gyroscopeMaxAngleY: 5
    };

    // Inicializa o efeito tilt nos cards e na foto do about
    VanillaTilt.init(document.querySelectorAll(".project-card, .about-image"), tiltConfig);

    // Controle do carrossel
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    let currentIndex = 0;
    let isAnimating = false;

    // Inicializa o primeiro slide como ativo e o segundo como next
    function initializeSlides() {
        slides[0].classList.add('active');
        slides[1]?.classList.add('next');
        // Inicializa o tilt no primeiro slide
        VanillaTilt.init(slides[0], tiltConfig);
    }

    function updateCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const nextIndex = direction === 'next' 
            ? (currentIndex + 1) % slides.length 
            : (currentIndex - 1 + slides.length) % slides.length;

        // Remove todas as classes e o tilt do slide atual
        slides.forEach(slide => {
            slide.classList.remove('active', 'next');
            if (slide.vanillaTilt) {
                slide.vanillaTilt.destroy();
            }
        });

        // Adiciona a classe next ao próximo slide
        slides[nextIndex].classList.add('next');

        // Após um pequeno delay, move o próximo slide para a posição ativa
        setTimeout(() => {
            slides[nextIndex].classList.remove('next');
            slides[nextIndex].classList.add('active');
            
            // Inicializa o tilt no novo slide ativo
            VanillaTilt.init(slides[nextIndex], tiltConfig);
            
            // Adiciona a classe next ao slide que virá depois
            const upcomingIndex = (nextIndex + 1) % slides.length;
            slides[upcomingIndex].classList.add('next');

            currentIndex = nextIndex;
            isAnimating = false;
        }, 50);
    }

    initializeSlides();

    prevButton.addEventListener('click', () => updateCarousel('prev'));
    nextButton.addEventListener('click', () => updateCarousel('next'));
}); 