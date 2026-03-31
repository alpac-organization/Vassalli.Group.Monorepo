import { ModuleEnum } from "@app/core/enums/module.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Settings, UsersRound, User } from "lucide-react";

export const sidebarData = {
  logoUrl:
    "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
  nameCompany: "CORE PANEL",

  items: [
    {
      id: "collaborators",
      label: "Colaboradores",
      path: "payroll/collaborators",
      icon: UsersRound,
    },
    {
      id: "settings",
      label: "Settings",
      path: "settings",
      icon: Settings,
      isFooter: true,
    },
    {
      id: "Perfil",
      label: "Perfil",
      path: "payroll/collaborator-profile",
      icon: User,
    },
  ],
};

export const sidebarDataTesting = {
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
        roles: [RoleEnum.ADMINISTRATOR, RoleEnum.SUPERVISOR, RoleEnum.OPERATOR],
      },
    ],
    [ModuleEnum.WORK_MANAGEMENT]: [
      {
        id: "profile",
        label: "Perfil",
        path: "payroll/collaborator-profile",
        icon: User,
        roles: [RoleEnum.ADMINISTRATOR, RoleEnum.SUPERVISOR, RoleEnum.OPERATOR],
      },
    ],
  },
};
