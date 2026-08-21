import { httpHandler } from "@app/core/adapters";
import { NotificationConfigServices } from "../../infrastructure/services/NotificationConfigServices";
import { useMutation } from "@tanstack/react-query";
import type { RegisterPushTokenRequest } from "../../domain/ApiContract/Requests/register-push-token.request";
import type { UnlinkPushTokenRequest } from "../../domain/ApiContract/Requests/unlink-push-token.request";

const notificationConfigServices = new NotificationConfigServices(httpHandler);

export const useNotificationConfig = function () {

   const RegisterPushToken = useMutation({
      mutationKey: ["register-push-token"],
      mutationFn: (request: RegisterPushTokenRequest) => notificationConfigServices.RegisterPushToken(request.company_id, request.token),
      retry: 1,
   });

   const UnlinkPushToken = useMutation({
      mutationKey: ["unlink-push-token"],
      mutationFn: (request: UnlinkPushTokenRequest) => notificationConfigServices.UnlinkPushToken(request.company_id, request.token),      
      retry: 1,
   });

   return {
      RegisterPushToken,
      UnlinkPushToken,
   }
};