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
