import { httpHandler } from "@app/core/adapters";
import { NotificationConfigServices } from "@app/modules/dashboard/infrastructure/services/NotificationConfigServices";
import { useMutation } from "@tanstack/react-query";
import type { RegisterPushTokenRequest } from "@app/modules/dashboard/domain/ApiContract/Requests/register-push-token.request";
import type { UnlinkPushTokenRequest } from "@app/modules/dashboard/domain/ApiContract/Requests/unlink-push-token.request";

const notificationConfigServices = new NotificationConfigServices(httpHandler);

export const useNotificationConfig = function () {

   const RegisterPushToken = useMutation({
      mutationKey: ["register-push-token"],
      mutationFn: (payload: RegisterPushTokenRequest) => notificationConfigServices.RegisterPushToken(payload),
      retry: 1,
   });

   const UnlinkPushToken = useMutation({
      mutationKey: ["unlink-push-token"],
      mutationFn: (payload: UnlinkPushTokenRequest) => notificationConfigServices.UnlinkPushToken(payload),      
      retry: 1,
   });

   return {
      RegisterPushToken,
      UnlinkPushToken,
   }
};