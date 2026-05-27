const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main > section");
const mainHeader = document.getElementById("MainHeader");
const floatingNav = document.getElementById("FloatingNav");

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        // Retire "active" de toutes les sections
        sections.forEach(section => section.classList.remove("active"));

        // Retire "active" de tous les liens des deux navs
        document.querySelectorAll("nav a").forEach(l => l.classList.remove("active"));

        // Active la section cible
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.classList.add("active");
        }

        // Active le lien cliqué + son équivalent dans l'autre nav
        const href = link.getAttribute("href");
        document.querySelectorAll(`nav a[href="${href}"]`).forEach(l => l.classList.add("active"));
    });
});

window.addEventListener("scroll", () => {
    const headerBottom = mainHeader.getBoundingClientRect().bottom;

    if (headerBottom < 0) {
        floatingNav.classList.add("visible");
    } else {
        floatingNav.classList.remove("visible");
    }
});