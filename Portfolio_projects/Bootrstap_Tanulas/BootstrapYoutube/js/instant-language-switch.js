(function () {
    if (!new URLSearchParams(window.location.search).has("instantLanguageSwitch")) {
        return;
    }

    document.documentElement.style.scrollBehavior = "auto";
    const url = new URL(window.location.href);
    url.searchParams.delete("instantLanguageSwitch");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);

    const restoreScrollBehavior = () => {
        window.setTimeout(() => {
            document.documentElement.style.removeProperty("scroll-behavior");
        }, 100);
    };

    if (document.readyState === "complete") {
        restoreScrollBehavior();
    } else {
        window.addEventListener("load", restoreScrollBehavior, { once: true });
    }
})();
