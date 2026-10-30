export function initializeTooltips() {
    const bootstrap = window.bootstrap;
    if (!bootstrap?.Tooltip) {
        throw new Error("Tooltip initialization failed: Bootstrap Tooltip is unavailable.");
    }

    document.querySelectorAll(".tt").forEach((tooltip) => {
        bootstrap.Tooltip.getOrCreateInstance(tooltip);
    });
}
