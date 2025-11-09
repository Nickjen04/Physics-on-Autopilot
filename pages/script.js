window.addEventListener('load', function() {
    // --- CÓDIGO DE PARTÍCULAS (Existente) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray;

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    window.addEventListener('resize', () => {
        setCanvasSize();
        init(); 
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; 
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = 'rgba(224, 231, 255, 0.7)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = Math.max(20, Math.floor((canvas.width * canvas.height) / 9000));
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
    
    // --- NUEVA LÓGICA DE NAVEGACIÓN ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Función para cambiar de página
    function changePage(targetId) {
        // Ocultar todas las secciones
        pageSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Mostrar la sección objetivo
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            // 'flex' es necesario para el layout de las secciones
            targetSection.style.display = 'flex'; 
        } else {
            // Si no se encuentra, mostrar inicio
            document.getElementById('inicio').style.display = 'flex';
        }
        
        // Actualizar el hash en la URL para mejor UX
        history.replaceState(null, null, `#${targetId}`);
        
        // Mover el scroll al inicio de la página al cambiar
        window.scrollTo(0, 0);

        // Close mobile nav if open
        if (navLinksContainer && navLinksContainer.classList.contains('open')) {
            navLinksContainer.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Añadir evento de clic a todos los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar comportamiento por defecto
            const targetId = link.getAttribute('data-target');
            if (targetId) {
                changePage(targetId);
            }
        });
    });

    // Manejar la carga inicial de la página si hay un hash (ej. #historia)
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        changePage(initialHash);
    } else {
        // Asegurarse de que 'inicio' se muestre si no hay hash
        changePage('inicio');
    }
    
    // --- NUEVA LÓGICA DE ANIMACIÓN EN SCROLL ---
    const observerOptions = {
        root: null, // usa el viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento debe ser visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Dejar de observar una vez que es visible
            }
        });
    }, observerOptions);

    // Observar todos los elementos que queramos animar
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });

    // --- Mobile nav toggle ---
    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', function() {
            const isOpen = navLinksContainer.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinksContainer || !navToggle) return;
        const target = e.target;
        if (!navLinksContainer.contains(target) && !navToggle.contains(target)) {
            if (navLinksContainer.classList.contains('open')) {
                navLinksContainer.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

});

