import {
  deleteToken,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";
import { messaging } from "@app/firebase-config";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

type ForegroundListener = (payload: MessagePayload) => void;

let currentToken: string | null = null;
let foregroundListener: ForegroundListener | null = null;
let listeningForeground = false;

function listenForegroundMessages() {
  if (listeningForeground) return;
  listeningForeground = true;

  onMessage(messaging, (payload) => {
    foregroundListener?.(payload);

    // FCM no muestra la notificacion cuando la app esta en primer plano,
    // la mostramos usando el service worker para que el click se maneje en el SW.
    const title = payload.notification?.title ?? "ALPAC";
    const body = payload.notification?.body ?? "";
    const url = (payload.data as { url?: string } | undefined)?.url ?? "/";

    navigator.serviceWorker.ready
      .then((registration) =>
        registration.showNotification(title, {
          body,
          icon: "/web-app-manifest-192x192.png",
          badge: "/web-app-manifest-192x192.png",
          tag: url,
          data: { url },
        }),
      )
      .catch((error) =>
        console.error("Error mostrando notificacion en primer plano:", error),
      );
  });
}

/**
 * Suscribe un callback para notificaciones recibidas con la app en primer plano.
 */
export function onForegroundNotification(listener: ForegroundListener) {
  foregroundListener = listener;
}

/**
 * Solicita permiso, obtiene el token FCM (VAPID) y lo registra en el backend
 * asociado al usuario autenticado (el user_id sale del JWT en el backend).
 */
export async function initPushNotifications(): Promise<void> {
  const fail = (reason: string): void => {
    console.warn(`[push] ${reason}`);
    alert(`[push] ${reason}`);
  };

  if (!VAPID_KEY) {
    fail(
      "Falta VITE_FIREBASE_VAPID_KEY. Si acabas de editar el .env, REINICIA el dev server (pnpm dev): Vite solo lee el .env al arrancar.",
    );
    return;
  }

  if (!(await isSupported())) {
    fail("Este navegador no soporta notificaciones push (¿estás en http:// o una IP de red? Debe ser localhost o HTTPS).");
    return;
  }

  if (typeof Notification === "undefined") {
    fail("Este contexto no expone la API Notification (se requiere localhost o HTTPS).");
    return;
  }

  if (Notification.permission === "denied") {
    fail("Permiso de notificaciones DENEGADO. Habilitalo en el candado de la barra de direcciones > Notificaciones > Permitir.");
    return;
  }

  try {
    const permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();

    if (permission !== "granted") {
      fail(`Permiso no concedido (estado: ${permission}).`);
      return;
    }

    // Si no hay ningun SW registrado, navigator.serviceWorker.ready queda colgado
    // para siempre: le ponemos tope de 10s para poder ver el error.
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Timeout esperando al service worker. Revisa DevTools > Application > Service Workers y recarga la pagina.",
              ),
            ),
          10_000,
        ),
      ),
    ]);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      fail("getToken() devolvio un token vacio (permiso concedido pero FCM no genero token).");
      return;
    }

    console.log(JSON.stringify(token, null, 3))

    currentToken = token;

    // await httpHandler.post("push-tokens", {
    //   token,
    //   device_name: getBrowserName(navigator.userAgent),
    // });

    listenForegroundMessages();
  } catch (error) {
    fail(`Error inicializando push: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Devuelve el token FCM del dispositivo actual (null si aun no se genero).
 */
export function getCurrentToken(): string | null {
   return currentToken;
}

/**
 * Desvincula el dispositivo actual del usuario (logout) y libera el token FCM.
 */
export async function unlinkPushOnLogout(): Promise<void> {
  try {
    if (!currentToken) return;

    await httpHandler.post("push-tokens/unlink", { token: currentToken });
    await deleteToken(messaging);
    currentToken = null;
  } catch (error) {
    console.error("[push] Error desvinculando el token push:", error);
    currentToken = null;
  }
}
