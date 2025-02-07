document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.nav-group a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

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

    // Inicializa o efeito tilt nos cards com parâmetros mais suaves
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
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
    });
}); 