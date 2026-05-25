const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main > section");
const mainHeader = document.getElementById("MainHeader");
const floatingNav = document.getElementById("FloatingNav");

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        sections.forEach(section => section.classList.remove("active"));

        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.classList.add("active");
        }
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