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

// Données des compétences
const competencesData = {
    "Réaliser un développement d'application": [
        "Implémenter des conceptions simples",
        "Élaborer des conceptions simples",
        "Développer des interfaces utilisateur",
        "Faire des essais et évaluer les résultats en regard des spécifications"
    ],
    "Optimiser des applications informatiques": [
        "Analyser un problème avec méthodes",
        "Comparer des algorithmes pour des problèmes classiques",
        "Expérimenter la notion de compilation et des représentations bas niveau des données",
        "Formaliser et mettre en oeuvre des outils mathématiques pour l'informatique"
    ],
    "Administrer des systèmes informatiques communicants complexes": [
        "Identifier les différents composants d'un système numérique",
        "Utiliser les fonctionnalités de base d'un système multitâches / multiutilisateurs",
        "Installer et configurer un système d'exploitation et des outils de développement",
        "Configurer un poste de travail dans un réseau d'entreprise"
    ],
    "Gérer des données de l'information": [
        "Mettre à jour et interroger une base de données relationnelle",
        "Visualiser des données",
        "Concevoir une base de données relationnelle à partir d'un cahier des charges"
    ],
    "Conduire un projet": [
        "Appréhender les besoins du client et de l'utilisateur",
        "Mettre en place les outils de gestion de projet",
        "Identifier les acteurs et les différentes phases d'un cycle de développement"
    ],
    "Travailler dans une équipe informatique": [
        "Appréhender l'écosystème numérique",
        "Découvrir les aptitudes requises selon les différents secteurs informatiques",
        "Identifier les statuts, les fonctions et les rôles de chaque membre d'une équipe pluridisciplinaire",
        "Acquérir les compétences interpersonnelles pour travailler en équipe"
    ]
};

const modal = document.getElementById("CompetenceModal");
const modalTitle = document.getElementById("ModalTitle");
const modalList = document.getElementById("ModalList");
const modalClose = document.getElementById("ModalClose");

document.querySelectorAll(".competence-link").forEach(btn => {
    btn.addEventListener("click", () => {
        const nom = btn.getAttribute("data-competence");
        const items = competencesData[nom] || [];

        modalTitle.textContent = nom;
        modalList.innerHTML = items.map(i => `<li>${i}</li>`).join("");
        modal.classList.remove("hidden");
    });
});

modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
});