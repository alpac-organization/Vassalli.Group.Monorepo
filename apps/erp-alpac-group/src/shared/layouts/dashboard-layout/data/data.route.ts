import { RoleEnum } from "@app/core/enums/role.enum";
import { ModuleEnum } from "@app/core/enums/module.enum";
import {
   Settings,
   UsersRound,
   User,
   UserKey,
   FileClock,
   CalendarCheck,
   DollarSign,
   CircleMinus,
   HandCoins
} from "lucide-react";
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

const applicationSection: SidebarLink = {
   id: "applications",
   label: "Solicitudes",
   path: "applications",
   icon: FileClock,
};

const gestionVacationsSection: SidebarLink = {
   id: "gestion-permisos",
   label: "Permisos",
   path: "work-management/gestion-permisos",
   icon: UserKey,
};

const controlVacationsSection: SidebarLink = {
   id: "control-vacaciones",
   label: "Control de vacaciones",
   path: "payroll/control-vacations",
   icon: CalendarCheck,
};

const gestionPayrollSection: SidebarLink = {
   id: "gestion-payroll",
   label: "Gestion de nómina",
   path: "payroll/gestion-nómina",
   icon: DollarSign,
};

const settingsSection: SidebarLink = {
   id: "settings",
   label: "Configuración",
   path: "configuración ",
   icon: Settings,
   isFooter: true,
};

const deduccionesSection: SidebarLink = {
   id: "deducciones",
   label: "Deducciones activas",
   path: "payroll/deducciones",
   icon: CircleMinus,
};

const liquidacionSection: SidebarLink = {
   id: "liquidacion",
   label: "Proceso de Liquidación",
   path: "payroll/liquidacion",
   icon: HandCoins,
};

const vacationPaymentSection: SidebarLink = {
   id: "vacation-payment",
   label: "Pago de Vacaciones",
   path: "payroll/vacation-payment",
   icon: HandCoins,
};

export const sidebarData = {
   logoUrl:
      "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
   nameCompany: "CORE PANEL",
   navigationRegistry: {
      [ModuleEnum.PAYROLL]: {
         [RoleEnum.ADMINISTRATOR]: [
            collboratorSection,
            controlVacationsSection,
            gestionPayrollSection,
            deduccionesSection,
            liquidacionSection,
            vacationPaymentSection
         ],
         [RoleEnum.OPERATOR]: [collboratorSection],
      },
      [ModuleEnum.WORK_MANAGEMENT]: {
         [RoleEnum.OPERATOR]: [
            collaboratorProfileSection,
            gestionVacationsSection,
         ],
      },
      [ModuleEnum.APPLICATIONS]: {
         [RoleEnum.MANAGER]: [applicationSection],
         [RoleEnum.ADMINISTRATOR]: [applicationSection],
      },
      [ModuleEnum.PUBLIC]: [settingsSection],
   },
};
