/* =====================================================================
   script.js : comportements dynamiques du portfolio
   =====================================================================
   Ce fichier fait 4 choses, dans cet ordre :
     1. Navigation entre les sections (À propos / Cursus / Projets)
        sans recharger la page (effet "application monopage").
     2. Navigation flottante : apparaît quand l'en-tête sort de l'écran.
     3. Fenêtre modale des PROJETS : bouton "En savoir plus" créé en JS.
     4. Fenêtre modale des COMPÉTENCES : liste détaillée par compétence.

   Vocabulaire utile :
     - DOM        : l'arbre des balises HTML manipulable depuis JavaScript.
     - classList  : permet d'ajouter / retirer des classes CSS d'un élément.
     - événement  : "click", "scroll", "keydown"... auquel on réagit avec
                    addEventListener(nomEvenement, fonctionAExecuter).
   ===================================================================== */


/* =====================================================================
   1. NAVIGATION PRINCIPALE ET FLOTTANTE
   ===================================================================== */

// Récupération des éléments HTML dont on a besoin.
// querySelectorAll renvoie TOUS les éléments qui correspondent au sélecteur CSS
// (c'est une NodeList : une sorte de tableau), alors que getElementById
// renvoie UN seul élément (celui qui a cet id).
const links = document.querySelectorAll("nav a");          // tous les liens des 2 barres de navigation (principale + flottante)
const sections = document.querySelectorAll("main > section"); // les sections ENFANTS DIRECTS de <main> (">" = enfant direct) : WhoIAm, Cursus, Projet
const mainHeader = document.getElementById("MainHeader");   // l'en-tête en haut de page (sert à savoir quand afficher la nav flottante)
const floatingNav = document.getElementById("FloatingNav"); // la barre de navigation flottante

// Pour chaque lien de navigation, on écoute le clic.
// "link => { ... }" est une fonction fléchée : link est le paramètre (le lien courant).
links.forEach(link => {
    // "e" (l'événement) est fourni automatiquement par le navigateur au clic.
    link.addEventListener("click", e => {
        // Par défaut, cliquer sur <a href="#Cursus"> fait défiler la page jusqu'à l'ancre.
        // On annule ce comportement : ici on veut juste AFFICHER / CACHER des sections.
        e.preventDefault();

        // Retire "active" de toutes les sections.
        // En CSS, seule la section ayant la classe "active" est visible
        // (les autres sont décalées hors de l'écran, voir Portfolio.scss).
        sections.forEach(section => section.classList.remove("active"));

        // Retire "active" de tous les liens des deux navs.
        // On re-sélectionne ici (et pas avec "links") pour être sûr d'avoir la liste à jour.
        document.querySelectorAll("nav a").forEach(l => l.classList.remove("active"));

        // Active la section cible.
        // link.getAttribute("href") vaut par exemple "#Cursus" ;
        // c'est aussi un sélecteur CSS valide (# = id) donc on peut le passer à querySelector.
        const target = document.querySelector(link.getAttribute("href"));
        if (target) { // sécurité : si aucun élément n'a cet id, target vaut null et on ne fait rien
            target.classList.add("active");
        }

        // Active le lien cliqué + son équivalent dans l'autre nav.
        // Les deux navs (principale et flottante) ont chacune un lien vers "#Cursus" :
        // le sélecteur [href="..."] les trouve tous les deux pour les mettre en surbrillance.
        const href = link.getAttribute("href");
        // `...${href}...` est un "template literal" : les backticks ` permettent d'insérer
        // une variable dans du texte avec ${variable}.
        document.querySelectorAll(`nav a[href="${href}"]`).forEach(l => l.classList.add("active"));
    });
});

// Affiche la navigation flottante lorsque l'en-tête sort de l'écran.
function updateFloatingNav() {
    // getBoundingClientRect() donne la position de l'élément PAR RAPPORT À LA FENÊTRE.
    // ".bottom" = position du bord bas de l'en-tête.
    // Valeur positive = le bas de l'en-tête est encore visible ; négative = il est passé au-dessus de l'écran.
    const headerBottom = mainHeader.getBoundingClientRect().bottom;

    if (headerBottom < 0) { // l'en-tête est totalement sorti de l'écran (vers le haut)
        floatingNav.classList.add("visible");    // la classe "visible" rend la nav flottante visible (voir le CSS)
    } else {
        floatingNav.classList.remove("visible"); // sinon on la recache
    }
}

// L'événement "scroll" se déclenche à chaque défilement de la page.
window.addEventListener("scroll", updateFloatingNav);
// On l'appelle aussi une fois au chargement, pour avoir le bon état dès le départ
// (par exemple si la page est rechargée alors qu'elle est déjà défilée).
updateFloatingNav();


/* =====================================================================
   2. DONNÉES : COMPÉTENCES ET ÉLÉMENTS À PRÉSENTER
   ===================================================================== */

// Correspondance entre chaque compétence et les éléments à présenter.
// C'est un OBJET JavaScript : { "clé": valeur, ... }.
// Ici la clé est le nom de la compétence et la valeur est un TABLEAU de textes.
// Ces clés doivent être IDENTIQUES (même orthographe, mêmes apostrophes)
// aux attributs data-competence="..." des boutons dans Portfolio.html,
// sinon la fenêtre modale ne trouvera pas la compétence.
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


/* =====================================================================
   3. RÉFÉRENCES VERS LES ÉLÉMENTS DES FENÊTRES MODALES
   ===================================================================== */
// Une "modale" est une fenêtre qui s'affiche par-dessus la page.
// Il y en a deux dans le HTML : une pour les projets, une pour les compétences.

// Éléments des deux fenêtres modales et boutons qui les ont ouvertes.
const projectModal = document.getElementById("ProjectModal");               // le fond sombre + la fenêtre (projet)
const projectModalTitle = document.getElementById("ProjectModalTitle");     // le titre <h2> de la modale projet
const projectModalContent = document.getElementById("ProjectModalContent"); // la zone où on insère les détails du projet
const projectModalClose = document.getElementById("ProjectModalClose");     // le bouton ✕ de la modale projet
const competenceModal = document.getElementById("CompetenceModal");         // le fond sombre + la fenêtre (compétence)
const competenceModalTitle = document.getElementById("ModalTitle");         // le titre <h2> de la modale compétence
const competenceModalList = document.getElementById("ModalList");           // la liste <ul> de la modale compétence
const competenceModalClose = document.getElementById("ModalClose");         // le bouton ✕ de la modale compétence

// On mémorise quel bouton a ouvert chaque modale pour pouvoir lui REDONNER le focus
// à la fermeture (accessibilité clavier : l'utilisateur reprend là où il en était).
// "let" (et non "const") car ces variables seront réaffectées plus tard.
// null = "aucune valeur pour l'instant".
let lastProjectTrigger = null;
let lastCompetenceTrigger = null;


/* =====================================================================
   4. MODALE DES PROJETS : création des résumés et boutons
   ===================================================================== */
// Dans le HTML, chaque projet est un <div> contenant :
//     <h1 data-summary="résumé court">Titre</h1>  +  <hr>  +  <section>détails complets</section>
// Ce code TRANSFORME chaque carte : il affiche un résumé + un bouton "En savoir plus",
// et cache les détails complets (qui seront affichés dans la modale au clic).

// Ajoute un résumé et un bouton qui ouvre les détails de chaque projet.
// "#Projet > div" = chaque <div> enfant direct de la section ayant l'id "Projet" (= une carte projet).
document.querySelectorAll("#Projet > div").forEach(card => {
    // ":scope >" signifie "à partir de l'élément `card` lui-même" : on ne cherche donc que
    // ses enfants DIRECTS. Sans ça, on pourrait récupérer un <h1> ou <section> imbriqué plus profondément.
    const title = card.querySelector(":scope > h1");      // le titre du projet
    const details = card.querySelector(":scope > section"); // le bloc de détails complets
    // "?." (optional chaining) : si `title` est null, on obtient undefined au lieu d'une erreur.
    // ".dataset.summary" lit l'attribut HTML data-summary="..." (dataset = tous les attributs data-*).
    const summary = title?.dataset.summary;

    // "!" = NON. Si l'un des trois éléments manque, on lève une erreur explicite.
    // ⚠ Attention : "throw" arrête tout le script (les modales de compétences ne fonctionneraient plus non plus).
    if (!title || !details || !summary) {
        throw new Error("Chaque projet doit avoir un titre, un résumé et ses détails.");
    }

    // --- Création du paragraphe de résumé ---
    const preview = document.createElement("p");   // crée un <p> en mémoire (pas encore dans la page)
    preview.className = "project-preview";         // lui donne la classe CSS "project-preview"
    // textContent insère du TEXTE brut (le HTML éventuel n'est pas interprété : plus sûr que innerHTML).
    preview.textContent = summary;

    // --- Création du bouton "En savoir plus" ---
    const button = document.createElement("button");
    button.className = "project-details-button";
    button.type = "button"; // "button" évite qu'il se comporte comme un bouton d'envoi de formulaire
    button.textContent = "En savoir plus";
    // Attributs ARIA : ils décrivent le bouton aux lecteurs d'écran (utilisateurs malvoyants).
    // aria-label : texte lu à la place du contenu du bouton (plus précis car il contient le titre du projet).
    // « » sont les guillemets français ; .trim() retire les espaces/retours à la ligne au début et à la fin.
    button.setAttribute("aria-label", `Afficher les détails de « ${title.textContent.trim()} »`);
    button.setAttribute("aria-haspopup", "dialog");        // annonce que ce bouton ouvre une fenêtre de dialogue
    button.setAttribute("aria-controls", "ProjectModal");  // indique l'id de l'élément contrôlé par ce bouton

    // On cache les détails complets dans la carte :
    details.classList.add("project-full-details"); // classe utilisée par le CSS (mise en page dans la modale)
    details.hidden = true;                         // attribut HTML "hidden" : l'élément n'est pas affiché
    // insertBefore(nouveau, reference) insère `nouveau` JUSTE AVANT `reference` dans la carte.
    // Ordre final dans la carte : <h1>, <hr>, <p résumé>, <bouton>, <section détails (cachée)>.
    card.insertBefore(preview, details);
    card.insertBefore(button, details);

    // Au clic sur le bouton : on remplit puis on ouvre la modale projet.
    button.addEventListener("click", () => {
        lastProjectTrigger = button; // mémorise le bouton pour lui rendre le focus à la fermeture
        projectModalTitle.textContent = title.textContent.trim(); // recopie le titre du projet dans la modale
        // cloneNode(true) fait une COPIE PROFONDE (avec tous les enfants) des détails.
        // On copie (et on ne déplace pas) pour que l'original reste dans la carte
        // et puisse être réutilisé à chaque ouverture.
        const modalDetails = details.cloneNode(true);
        modalDetails.hidden = false; // la copie, elle, doit être visible
        // replaceChildren(x) vide la zone puis y place x : on remplace l'ancien contenu (projet précédent).
        projectModalContent.replaceChildren(modalDetails);
        projectModal.classList.remove("hidden");       // "hidden" = display:none en CSS ; on la retire pour afficher la modale
        projectModal.setAttribute("aria-hidden", "false"); // indique aux lecteurs d'écran que la modale est maintenant visible
        projectModalClose.focus(); // place le curseur clavier sur le bouton ✕ (accessibilité)
    });
});


/* =====================================================================
   5. FONCTIONS COMMUNES AUX DEUX MODALES
   ===================================================================== */

// Ferme une fenêtre modale et rend le focus au bouton d'ouverture.
// Paramètres : modal = l'élément modale à fermer ; trigger = le bouton qui l'avait ouverte.
function closeModal(modal, trigger) {
    modal.classList.add("hidden");               // la cache (display:none via le CSS)
    modal.setAttribute("aria-hidden", "true");   // la masque aussi pour les lecteurs d'écran
    trigger?.focus();                            // "?." : si trigger est null, on ne fait rien (pas d'erreur)
}

// Remplit puis ouvre la fenêtre modale de la compétence choisie.
// Paramètre : button = le bouton de compétence sur lequel on a cliqué.
function openCompetenceModal(button) {
    const nom = button.getAttribute("data-competence"); // ex. "Conduire un projet" (lu dans le HTML)
    const items = competencesData[nom];                 // va chercher le tableau correspondant dans l'objet de la section 2

    // Si le nom est vide OU qu'aucune entrée n'existe pour ce nom (faute de frappe dans le HTML ?),
    // on lève une erreur claire pour faciliter le débogage.
    if (!nom || !items) {
        throw new Error("Compétence introuvable pour ce bouton.");
    }

    lastCompetenceTrigger = button; // mémorise pour rendre le focus à la fermeture
    competenceModalTitle.textContent = nom;
    // .map(...) transforme CHAQUE texte du tableau en un élément <li> (renvoie un nouveau tableau de <li>).
    // "..." (opérateur de décomposition / spread) "déballe" ce tableau pour le passer
    // comme une suite d'arguments à replaceChildren(li1, li2, li3...).
    competenceModalList.replaceChildren(
        ...items.map(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem; // la valeur renvoyée par la fonction devient un élément du nouveau tableau
        })
    );
    competenceModal.classList.remove("hidden");
    competenceModal.setAttribute("aria-hidden", "false");
    competenceModalClose.focus();
}


/* =====================================================================
   6. ÉVÉNEMENTS : ouverture et fermeture des modales
   ===================================================================== */

// Délégation des clics pour prendre en charge tous les boutons de compétence.
// Au lieu d'écouter chaque bouton un par un, on écoute TOUT le document et on regarde
// sur quoi l'utilisateur a cliqué. Avantage : ça marche aussi pour des boutons
// créés plus tard, par exemple ceux qui sont dans les détails copiés dans la modale projet.
document.addEventListener("click", event => {
    // event.target = l'élément exactement cliqué. On vérifie que c'est bien un élément HTML
    // (et pas, par exemple, un noeud texte) avant d'appeler .closest() dessus.
    if (!(event.target instanceof Element)) return; // "return" quitte la fonction immédiatement

    // .closest(sélecteur) remonte depuis l'élément cliqué vers ses parents jusqu'à trouver
    // un élément qui correspond au sélecteur (ici la classe .competence-link). Renvoie null sinon.
    const competenceButton = event.target.closest(".competence-link");
    if (competenceButton) {
        openCompetenceModal(competenceButton);
    }
});

// Fermeture par bouton, clic sur l'arrière-plan ou touche Échap.

// Bouton ✕ de la modale projet.
projectModalClose.addEventListener("click", () => {
    closeModal(projectModal, lastProjectTrigger);
});
// Clic sur le fond sombre de la modale projet.
// event.target === projectModal : on ne ferme que si le clic a visé DIRECTEMENT le fond.
// Un clic à l'intérieur de la fenêtre blanche a pour cible un élément enfant : on ne ferme pas.
projectModal.addEventListener("click", event => {
    if (event.target === projectModal) {
        closeModal(projectModal, lastProjectTrigger);
    }
});
// Bouton ✕ de la modale compétence.
competenceModalClose.addEventListener("click", () => {
    closeModal(competenceModal, lastCompetenceTrigger);
});
// Clic sur le fond sombre de la modale compétence (même principe que pour le projet).
competenceModal.addEventListener("click", event => {
    if (event.target === competenceModal) {
        closeModal(competenceModal, lastCompetenceTrigger);
    }
});
// Touche Échap (écoutée sur tout le document).
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return; // toute autre touche : on ne fait rien

    // On ferme UNE SEULE modale par appui : la modale compétence d'abord (elle peut être
    // ouverte par-dessus la modale projet, car ses boutons sont dans les détails du projet),
    // sinon la modale projet.
    // .contains("hidden") vaut true si la classe est présente, donc si la modale est cachée ;
    // le "!" inverse : "si la modale n'est PAS cachée (= elle est ouverte)".
    if (!competenceModal.classList.contains("hidden")) {
        closeModal(competenceModal, lastCompetenceTrigger);
    } else if (!projectModal.classList.contains("hidden")) {
        closeModal(projectModal, lastProjectTrigger);
    }
});
