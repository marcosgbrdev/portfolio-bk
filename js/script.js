document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // --- Lógica do Menu Mobile ---
    // =============================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Alterna ícone entre hamburguer e X
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Fecha o menu ao clicar em um link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });


    // =============================================
    // --- Lógica de Digitação (Typewriter) ---
    // =============================================
    const codeElement = document.getElementById('typewriter');

    // Mensagem moderna representando o dev
    const codeText = `class Developer {
  name = "Marcos BK";
  focus = ["Web Systems",
           "Automation", "AI"];
  stack = ["JS", "React",
           "Supabase", "APIs"];
  mission = "Build real solutions";
}`;

    let index = 0;

    function typeCode() {
        if (index < codeText.length) {
            codeElement.innerHTML += codeText.charAt(index);
            index++;
            // Velocidade aleatória para parecer digitação humana (30ms a 90ms)
            setTimeout(typeCode, Math.random() * 60 + 30);
        }
    }

    // Inicia a digitação com um pequeno delay
    setTimeout(typeCode, 800);


    // =============================================
    // --- Scroll Spy (Active Nav Link) ---
    // =============================================
    const sections = document.querySelectorAll('section[id]');

    function activateNavOnScroll() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', activateNavOnScroll);


    // =============================================
    // --- Fade In on Scroll (Cards / Seções) ---
    // =============================================
    const cards = document.querySelectorAll('.card');

    // Adiciona a classe fade-in a todos os cards
    cards.forEach(card => {
        card.classList.add('fade-in');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

});