import { Drawer } from "@alpac/design-system";
import { useNotificationSidebarStore } from "@app/shared/stores/useNotificationSidebarStore";
import { Notification } from "@app/shared/components/notification/notification/notification";

export const NotificationSidebar = () => {
   const { isOpen, closeNotifications } = useNotificationSidebarStore();
   return (
      <Drawer
         isOpen={isOpen}
         onClose={closeNotifications}
         title="Notificaciones"
         position="right"
      >
         <Notification title="Notificación" description="Descripción" date="Fecha" time="Hora" />
         <Notification title="Notificación" description="Descripción" date="Fecha" time="Hora" />
         <Notification title="Notificación" description="Descripción" date="Fecha" time="Hora" />
         <Notification title="Notificación" description="Descripción" date="Fecha" time="Hora" />
      </Drawer>
   );
};