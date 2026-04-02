import { ModuleEnum } from "@app/core/enums/module.enum";
import { UserTypeEnum } from "@app/core/enums/user.type.enum";
import { Settings, UsersRound, User } from "lucide-react";

export const sidebarData = {
  logoUrl:
    "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
  nameCompany: "CORE PANEL",
  navigationRegistry: {
    [ModuleEnum.PAYROLL]: [
      {
        id: "collaborators",
        label: "Colaboradores",
        path: "payroll/collaborators",
        icon: UsersRound,
        user_types: [UserTypeEnum.STANDARD_USER],
      },
    ],
    [ModuleEnum.WORK_MANAGEMENT]: [
      {
        id: "collaborator-profile",
        label: "Perfil",
        path: "work-management/collaborator-profile",
        icon: User,
        user_types: [
          UserTypeEnum.STANDARD_USER,
          UserTypeEnum.EMPLOYEE_SELF_SERVICE,
        ],
      },
    ],
    [ModuleEnum.GENERIC]: [
      {
        id: "settings",
        label: "Settings",
        path: "settings",
        icon: Settings,
        isFooter: true,
        user_types: [
          UserTypeEnum.STANDARD_USER,
          UserTypeEnum.EMPLOYEE_SELF_SERVICE,
        ],
      },
    ],
  },
};
