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

const projectModal = document.getElementById("ProjectModal");
const projectModalTitle = document.getElementById("ProjectModalTitle");
const projectModalContent = document.getElementById("ProjectModalContent");
const projectModalClose = document.getElementById("ProjectModalClose");
const competenceModal = document.getElementById("CompetenceModal");
const competenceModalTitle = document.getElementById("ModalTitle");
const competenceModalList = document.getElementById("ModalList");
const competenceModalClose = document.getElementById("ModalClose");
let lastProjectTrigger = null;
let lastCompetenceTrigger = null;

document.querySelectorAll("#Projet > div").forEach(card => {
    const title = card.querySelector(":scope > h1");
    const details = card.querySelector(":scope > section");
    const summary = title?.dataset.summary;

    if (!title || !details || !summary) {
        throw new Error("Chaque projet doit avoir un titre, un résumé et ses détails.");
    }

    const preview = document.createElement("p");
    preview.className = "project-preview";
    preview.textContent = summary;

    const button = document.createElement("button");
    button.className = "project-details-button";
    button.type = "button";
    button.textContent = ">>";
    button.setAttribute("aria-label", `Afficher les détails de « ${title.textContent.trim()} »`);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "ProjectModal");

    details.classList.add("project-full-details");
    details.hidden = true;
    card.insertBefore(preview, details);
    card.insertBefore(button, details);

    button.addEventListener("click", () => {
        lastProjectTrigger = button;
        projectModalTitle.textContent = title.textContent.trim();
        const modalDetails = details.cloneNode(true);
        modalDetails.hidden = false;
        projectModalContent.replaceChildren(modalDetails);
        projectModal.classList.remove("hidden");
        projectModal.setAttribute("aria-hidden", "false");
        projectModalClose.focus();
    });
});

function closeModal(modal, trigger) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    trigger?.focus();
}

function openCompetenceModal(button) {
    const nom = button.getAttribute("data-competence");
    const items = competencesData[nom];

    if (!nom || !items) {
        throw new Error("Compétence introuvable pour ce bouton.");
    }

    lastCompetenceTrigger = button;
    competenceModalTitle.textContent = nom;
    competenceModalList.replaceChildren(
        ...items.map(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        })
    );
    competenceModal.classList.remove("hidden");
    competenceModal.setAttribute("aria-hidden", "false");
    competenceModalClose.focus();
}

document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;

    const competenceButton = event.target.closest(".competence-link");
    if (competenceButton) {
        openCompetenceModal(competenceButton);
    }
});

projectModalClose.addEventListener("click", () => {
    closeModal(projectModal, lastProjectTrigger);
});
projectModal.addEventListener("click", event => {
    if (event.target === projectModal) {
        closeModal(projectModal, lastProjectTrigger);
    }
});
competenceModalClose.addEventListener("click", () => {
    closeModal(competenceModal, lastCompetenceTrigger);
});
competenceModal.addEventListener("click", event => {
    if (event.target === competenceModal) {
        closeModal(competenceModal, lastCompetenceTrigger);
    }
});
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (!competenceModal.classList.contains("hidden")) {
        closeModal(competenceModal, lastCompetenceTrigger);
    } else if (!projectModal.classList.contains("hidden")) {
        closeModal(projectModal, lastProjectTrigger);
    }
});