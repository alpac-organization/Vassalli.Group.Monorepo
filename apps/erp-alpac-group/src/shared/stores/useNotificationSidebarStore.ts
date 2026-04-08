import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationSidebarState {
   isOpen: boolean;
   openNotifications: () => void;
   closeNotifications: () => void;
}

export const useNotificationSidebarStore = create<NotificationSidebarState>()(
   persist(
      (set) => ({
         isOpen: false,
         openNotifications: () => set({ isOpen: true }),
         closeNotifications: () => set({ isOpen: false }),
      }),
      {
         name: 'notification-sidebar',
      },
   ),
);