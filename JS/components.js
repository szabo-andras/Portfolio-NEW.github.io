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
    let currentPage = window.location.pathname.split("/").pop();
    if (!currentPage) currentPage = "index.html";

    const links = document.querySelectorAll(".navbar_linkek");
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}
