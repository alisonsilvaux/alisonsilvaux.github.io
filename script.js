document.addEventListener('DOMContentLoaded', async function() {
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

    // Sistema de tradução
    let translations;
    let currentLang = localStorage.getItem('language') || 'pt';

    // Função para carregar traduções
    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Traduções carregadas com sucesso:', data);
            translations = data;
            updateLanguage(currentLang);
            updateLanguageToggle();
        } catch (error) {
            console.error('Erro ao carregar traduções:', error);
        }
    }

    // Carrega as traduções imediatamente
    await loadTranslations();

    // Atualiza os botões de idioma
    function updateLanguageToggle() {
        console.log('Atualizando botões de idioma para:', currentLang);
        document.querySelectorAll('.language-toggle a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === currentLang) {
                link.classList.add('active');
            }
        });
    }

    // Atualiza o texto da página
    function updateLanguage(lang) {
        console.log('Atualizando idioma para:', lang);
        if (!translations) {
            console.error('Traduções não carregadas ainda');
            return;
        }

        const t = translations[lang];
        if (!t) {
            console.error('Traduções não encontradas para o idioma:', lang);
            return;
        }

        try {
            // Navegação
            document.querySelector('a[href="#home"]').textContent = t.nav.home;
            document.querySelector('a[href="#greatest-hits"]').textContent = t.nav.projects;
            document.querySelector('a[href="#educational"]').textContent = t.nav.educational;
            document.querySelector('a[href="#about"]').textContent = t.nav.about;
            document.querySelector('.cta-button').textContent = t.nav.cta;

            // Hero
            document.querySelector('.left-group span:nth-child(1)').textContent = t.hero.greeting;
            document.querySelector('.left-group span:nth-child(2)').textContent = t.hero.im;
            document.querySelector('.left-group .highlight').textContent = t.hero.name;
            document.querySelector('.right-group .highlight').textContent = t.hero.role;
            document.querySelector('.right-group span:nth-child(2)').textContent = t.hero.from;
            document.querySelector('.right-group span:nth-child(3)').textContent = t.hero.country;
            document.querySelector('.hero-text').textContent = t.hero.tagline;
            document.querySelector('.current-role').innerHTML = `${t.hero.currentRole} <a href="https://us.trustly.com/" target="_blank" rel="noopener noreferrer" class="highlight">@Trustly</a>`;
            document.querySelector('.companies p').textContent = t.hero.companies;

            // Projetos
            document.querySelector('#greatest-hits h2').textContent = t.projects.title;
            document.querySelector('#greatest-hits > p').textContent = t.projects.subtitle;

            // Seção educacional
            document.querySelector('.sharing-card h2').textContent = t.educational.title;
            document.querySelector('.sharing-card p').textContent = t.educational.description;
            document.querySelector('.education-platforms p').textContent = t.educational.speaking;

            // Sobre
            document.querySelector('.about h2').textContent = t.about.title;
            const aboutParagraphs = document.querySelectorAll('.about-text p');
            aboutParagraphs[0].textContent = t.about.p1;
            aboutParagraphs[1].textContent = t.about.p2;
            aboutParagraphs[2].textContent = t.about.p3;
            aboutParagraphs[3].textContent = t.about.p4;
            document.querySelector('.download-button').textContent = t.about.download;

            // Footer
            document.querySelector('.linkedin-button').textContent = t.footer.cta;

            console.log('Tradução concluída com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar traduções:', error);
        }
    }

    // Event listeners para os botões de idioma
    document.querySelectorAll('.language-toggle a').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            console.log('Mudando idioma para:', lang);
            currentLang = lang;
            localStorage.setItem('language', lang);
            
            // Se as traduções não estiverem carregadas, carrega primeiro
            if (!translations) {
                await loadTranslations();
            } else {
                updateLanguage(lang);
                updateLanguageToggle();
            }
        });
    });
}); 