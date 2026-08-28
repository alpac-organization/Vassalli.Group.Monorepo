/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import type { PrecacheEntry } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

declare let self: ServiceWorkerGlobalScope & typeof globalThis & {
  __WB_MANIFEST: (string | PrecacheEntry)[];
};

// TypeScript no incluye estos campos en NotificationOptions por defecto,
// aunque sí son válidos en el spec real de Service Workers.
interface ExtendedNotificationOptions extends NotificationOptions {
  image?: string;
  actions?: { action: string; title: string; icon?: string }[];
  vibrate?: number[];
}

self.skipWaiting();
clientsClaim();

// Precache de assets compilados
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

try {
  registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));
}
catch (e) {
  console.warn("Navegación Workbox no disponible en modo dev estricto:", e);
}

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  const title = payload.data?.title ?? "ALPAC";
  const body = payload.data?.body ?? "";
  const image = payload.data?.image;
  
  const icon = payload.data?.icon ?? "/web-app-manifest-192x192.png";
  const url = payload.data?.url ?? "/";

  const uniqueTag =
    payload.messageId ?? `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const notificationOptions: ExtendedNotificationOptions = {
    body,
    icon,
    badge: icon,
    image,
    tag: uniqueTag,
    data: { url },
    actions: [{ action: "open", title: "Ver más" }],
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url =
    (event.notification.data as { url?: string } | undefined)?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});