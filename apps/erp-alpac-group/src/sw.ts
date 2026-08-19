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

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

if (!import.meta.env.DEV) {
  registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));
}

// Firebase Cloud Messaging (background push)
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
  const title = payload.notification?.title ?? "ALPAC";
  const body = payload.notification?.body ?? "";
  const url = (payload.data as { url?: string } | undefined)?.url ?? "/";

  return self.registration.showNotification(title, {
    body,
    icon: "/web-app-manifest-192x192.png",
    badge: "/web-app-manifest-192x192.png",
    tag: url,
    data: { url },
  });
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