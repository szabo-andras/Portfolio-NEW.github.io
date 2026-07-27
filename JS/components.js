function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return;

    fetch(file)
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;

            if (id === "navbar") {
                setActiveLink();
            }
        });
}


loadComponent("navbar", "/Components/navbar.html");
loadComponent("footer", "/Components/footer.html");
loadComponent("contact_form", "/Components/contact_form.html");
loadComponent("project-upload-form", "/Components/project_upload_form.html");

function setActiveLink() {
    const currentPage = window.location.pathname.split("/").pop() || "portfolio.html";

    const links = document.querySelectorAll("#navbar .navbar_linkek");
    links.forEach(link => {
        const linkPage = new URL(link.getAttribute("href"), window.location.href)
            .pathname
            .split("/")
            .pop();
        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
            link.style.backgroundColor = "var(--accent-secondary-dark)";
            link.style.color = "var(--text-primary)";
            link.style.borderBottomColor = "var(--color-primary-200)";
            link.style.boxShadow = "inset 0 -2px 0 var(--color-primary-50)";
        } else {
            link.removeAttribute("aria-current");
            link.style.removeProperty("background-color");
            link.style.removeProperty("color");
            link.style.removeProperty("border-bottom-color");
            link.style.removeProperty("box-shadow");
        }
    });
}
