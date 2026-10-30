export function initializeOffcanvas() {
    const bootstrap = window.bootstrap;
    if (!bootstrap?.Offcanvas) {
        throw new Error("Offcanvas initialization failed: Bootstrap Offcanvas is unavailable.");
    }

    document.querySelectorAll(".js-switch-offcanvas").forEach((button) => {
        button.addEventListener("click", () => {
            const targetSelector = button.dataset.target;
            const target = targetSelector ? document.querySelector(targetSelector) : null;

            if (!(target instanceof HTMLElement) || !target.classList.contains("offcanvas")) {
                throw new Error(`Offcanvas target is missing or invalid: ${targetSelector}`);
            }

            const current = document.querySelector(".offcanvas.show");
            if (current instanceof HTMLElement && current !== target) {
                current.addEventListener(
                    "hidden.bs.offcanvas",
                    () => bootstrap.Offcanvas.getOrCreateInstance(target).show(),
                    { once: true },
                );
                bootstrap.Offcanvas.getOrCreateInstance(current).hide();
                return;
            }

            bootstrap.Offcanvas.getOrCreateInstance(target).show();
        });
    });
}
