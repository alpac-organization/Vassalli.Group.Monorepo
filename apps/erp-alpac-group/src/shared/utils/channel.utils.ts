import { ChannelEnum } from "@app/core/enums/channel.enum";
import { RoleEnum } from "@app/core/enums/role.enum";

export const getChannelByRole = (role: RoleEnum): number | null => {
   switch (role) {
      case RoleEnum.ADMINISTRATOR:
         return ChannelEnum["AdministrativePanel"].value;
      case RoleEnum.MANAGER:
         return ChannelEnum["DirectManagerPanel"].value;
      case RoleEnum.OPERATOR:
         return ChannelEnum["PersonalPanel"].value;
      default:
         return null;
   }
}