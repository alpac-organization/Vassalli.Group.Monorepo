import type { Platform } from "./notification-banner.types";

export const detectPlatform = (): Platform => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
    if (/Android/.test(ua)) return "android";
    return "desktop";
};

export const getInstructions = (platform: Platform): { title: string; steps: string[] } => {
    switch (platform) {
        case "ios":
            return {
                title: "Activar en iPhone",
                steps: [
                    "Abrí la app Configuración de tu iPhone",
                    "Buscá y tocá el nombre de esta app en la lista (o Safari, si la abriste desde ahí)",
                    "Tocá 'Notificaciones'",
                    "Activá 'Permitir notificaciones'",
                ],
            };
        case "android":
            return {
                title: "Activar en Android",
                steps: [
                    "Mantené presionado el ícono de la app en tu pantalla de inicio",
                    "Tocá 'Información de la app' (ícono de i)",
                    "Tocá 'Notificaciones'",
                    "Activá el interruptor principal",
                ],
            };
        case "desktop":
            return {
                title: "Activar en tu navegador",
                steps: [
                    "Hacé clic en el ícono de candado (🔒) a la izquierda de la URL",
                    "Buscá 'Notificaciones' en la lista de permisos",
                    "Cambiá el valor de 'Bloquear' a 'Permitir'",
                    "Recargá la página",
                ],
            };
    }
};

// Intenta abrir la configuración de notificaciones del dispositivo. Los deep
// links del sistema no son 100% confiables desde la web/PWA: se intentan y, si
// fallan, queda visible el instructivo del modal (getInstructions) en pantalla.
export const redirectToSettings = (platform: Platform): void => {
    switch (platform) {
        case "ios":
            try {
                window.location.href = "app-settings:root=Notifications";
            } catch {
                /* deep link no disponible */
            }
            break;
        case "android":
            try {
                window.location.href = "intent:#Intent;action=android.settings.APP_NOTIFICATION_SETTINGS;end";
            } catch {
                /* deep link no disponible */
            }
            break;
        case "desktop":
        default:
            // Chrome/Firefox/Edge no exponen una URL de ajustes por sitio desde la web.
            // El instructivo del modal es la guía a seguir.
            break;
    }
};
