import { RoleEnum } from "@app/core/enums/role.enum";
import { ModuleEnum } from "@app/core/enums/module.enum";
import { Settings, UsersRound, User, Calendar } from "lucide-react";
import type { SidebarLink } from "../components/Sidebar/types/sidebar.types";

const collboratorSection: SidebarLink = {
  id: "collaborators",
  label: "Colaboradores",
  path: "payroll/collaborators",
  icon: UsersRound,
};

const collaboratorProfileSection: SidebarLink = {
  id: "collaborator-profile",
  label: "Perfil",
  path: "work-management/collaborator-profile",
  icon: User,
};

const gestionVacationsSection: SidebarLink = {
  id: "gestion-vacations",
  label: "vacaciones",
  path: "work-management/gestion-vacations",
  icon: Calendar,
};
const settingsSection: SidebarLink = {
  id: "settings",
  label: "Settings",
  path: "settings",
  icon: Settings,
  isFooter: true,
};

export const sidebarData = {
  logoUrl:
    "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
  nameCompany: "CORE PANEL",
  navigationRegistry: {
    [ModuleEnum.PAYROLL]: {
      [RoleEnum.MANAGER]: [collboratorSection],
      [RoleEnum.ADMINISTRATOR]: [collboratorSection],
    },
    [ModuleEnum.WORK_MANAGEMENT]: {
      [RoleEnum.OPERATOR]: [
        collaboratorProfileSection,
        gestionVacationsSection,
      ],
    },
    [ModuleEnum.PUBLIC]: [settingsSection],
  },
};
