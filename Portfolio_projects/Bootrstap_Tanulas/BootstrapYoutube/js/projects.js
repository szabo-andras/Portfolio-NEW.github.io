export function initializeProjects() {
    const bootstrap = window.bootstrap;
    if (!bootstrap?.Tab) {
        throw new Error("Project selector initialization failed: Bootstrap Tab is unavailable.");
    }

    document.querySelectorAll(".project-selector").forEach((projectSelector) => {
        projectSelector.querySelectorAll(".dropdown-item[data-bs-target]").forEach((item) => {
            item.addEventListener("click", () => {
                const target = item.getAttribute("data-bs-target");
                const tabButton = [...projectSelector.querySelectorAll("#projectTabs [data-bs-target]")].find(
                    (button) => button.getAttribute("data-bs-target") === target,
                );

                if (tabButton) {
                    bootstrap.Tab.getOrCreateInstance(tabButton).show();
                }

                projectSelector.querySelectorAll(".dropdown-item[data-bs-target]").forEach((dropdownItem) => {
                    dropdownItem.classList.remove("active");
                    dropdownItem.removeAttribute("aria-current");
                });

                item.classList.add("active");
                item.setAttribute("aria-current", "true");
                projectSelector.classList.add("project-selected");

                const projectDropdownToggle = projectSelector.querySelector(".dropdown.d-md-none .dropdown-toggle");
                if (projectDropdownToggle) {
                    projectDropdownToggle.textContent = item.textContent.trim();
                }
            });
        });
    });
}
