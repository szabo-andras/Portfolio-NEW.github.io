function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            if (id === "navbar") {
                setActiveLink();
            }
        });
}


loadComponent("navbar", "/components/navbar.html");
loadComponent("footer", "/components/footer.html");
loadComponent("contact_form", "/components/contact_form.html");
loadComponent("project-upload-form", "/components/project_upload_form.html");

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