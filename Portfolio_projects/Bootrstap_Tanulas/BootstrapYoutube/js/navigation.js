export function initializeNavigation() {
    const navbar = document.querySelector(".navbar");
    const header = document.querySelector("header");
    const navbarCollapse = document.getElementById("navbar");

    if (!navbar || !header || !navbarCollapse) {
        throw new Error("Navigation initialization failed: expected navbar, header, or collapse element is missing.");
    }

    const syncNavigationHeights = () => {
        document.documentElement.style.setProperty("--navbar-height", `${navbar.offsetHeight}px`);
        document.documentElement.style.setProperty(
            "--header-height",
            `${header.getBoundingClientRect().height}px`,
        );
    };

    syncNavigationHeights();
    new ResizeObserver(syncNavigationHeights).observe(header);

    const bootstrap = window.bootstrap;
    if (!bootstrap?.Collapse) {
        throw new Error("Navigation initialization failed: Bootstrap Collapse is unavailable.");
    }

    const navbarCollapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
        toggle: false,
    });

    navbarCollapse.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));

            if (!target || !navbarCollapse.classList.contains("show")) {
                return;
            }

            event.preventDefault();
            navbarCollapse.addEventListener(
                "hidden.bs.collapse",
                () => {
                    window.history.pushState(null, "", link.hash);
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                },
                { once: true },
            );
            navbarCollapseInstance.hide();
        });
    });

    document.querySelectorAll("[data-language-link]").forEach((link) => {
        link.addEventListener("click", () => {
            const navbarBottom = header.getBoundingClientRect().bottom;
            const sections = [...document.querySelectorAll("main section[id]")];
            const viewportCenter = navbarBottom + (window.innerHeight - navbarBottom) / 2;
            const currentSection =
                sections.find((section) => {
                    const bounds = section.getBoundingClientRect();
                    return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
                }) ??
                sections.reduce(
                    (nearest, section) =>
                        Math.abs(section.getBoundingClientRect().top - viewportCenter) <
                        Math.abs(nearest.getBoundingClientRect().top - viewportCenter)
                            ? section
                            : nearest,
                    sections[0],
                );

            if (currentSection) {
                const destination = new URL(link.href);
                destination.hash = currentSection.id;
                destination.searchParams.set("instantLanguageSwitch", "");
                link.href = destination.href;
            }
        });
    });
}
