// Filled application shell.
// Keep startup/wiring separate from business logic.
// Security-sensitive decisions remain server-side.
export function startApplication() {
    document.documentElement.dataset.appReady = "true";
}
