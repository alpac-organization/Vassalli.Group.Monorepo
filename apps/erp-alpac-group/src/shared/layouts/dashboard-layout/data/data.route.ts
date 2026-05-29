import { RoleEnum } from "@app/core/enums/role.enum";
import { ModuleEnum } from "@app/core/enums/module.enum";
import {
  UsersRound,
  User,
  UserKey,
  FileClock,
  CalendarCheck,
  DollarSign,
  CircleMinus,
  HandCoins,
  History,
  Scale,
  Settings,
  Users,
  Book,
} from "lucide-react";

import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

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

const applicationFromPayrollSection: SidebarLink = {
  id: "applications",
  label: "Solicitudes de Permisos",
  path: "payroll/applications",
  icon: FileClock,
};

const permissionManagementSection: SidebarLink = {
  id: "gestion-permisos",
  label: "Permisos",
  path: "work-management/gestion-permisos",
  icon: UserKey,
};

const controlVacationsSection: SidebarLink = {
  id: "control-vacaciones",
  label: "Control de Vacaciones",
  path: "payroll/control-vacations",
  icon: CalendarCheck,
};

const gestionPayrollSection: SidebarLink = {
  id: "gestion-payroll",
  label: "Gestión de Nómina",
  path: "payroll/gestion-nomina",
  icon: DollarSign,
};

const payrollPeriodsHistorySection: SidebarLink = {
  id: "historial-periodos-nómina",
  label: "Períodos de Nómina",
  path: "payroll/historial-periodos-nomina",
  icon: History,
};

const deduccionesSection: SidebarLink = {
  id: "deducciones",
  label: "Deducciones Activas",
  path: "payroll/deducciones",
  icon: CircleMinus,
};

const liquidacionSection: SidebarLink = {
  id: "liquidacion",
  label: "Proceso de Liquidación",
  path: "payroll/liquidacion",
  icon: HandCoins,
};

const scaleControlSection: SidebarLink = {
  id: "scale-control",
  label: "Control de Báscula",
  path: "storage",
  icon: Scale,
};

const administrationUsersSection: SidebarLink = {
  id: "administration",
  label: "Usuarios",
  path: "administration/users",
  icon: Users,
};
const administrationCatalogosSection: SidebarLink = {
  id: "catalogos",
  label: "Catálogos",
  path: "administration/catalogos",
  icon: Book,
};

export const sidebarData = {
  logoUrl:
    "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
  nameCompany: "CORE PANEL",
  navigationRegistry: {
    [ModuleEnum.PAYROLL]: {
      [RoleEnum.ADMINISTRATOR]: [
        collboratorSection,
        gestionPayrollSection,
        payrollPeriodsHistorySection,
        applicationFromPayrollSection,
        deduccionesSection,
        liquidacionSection,
        controlVacationsSection,
      ],
    },
    [ModuleEnum.ADMINISTRATION]: {
      [RoleEnum.ADMINISTRATOR]: [
        administrationUsersSection,
        administrationCatalogosSection,
      ],
    },
    [ModuleEnum.WORK_MANAGEMENT]: {
      [RoleEnum.OPERATOR]: [
        collaboratorProfileSection,
        permissionManagementSection,
      ],
    },
    /*  [ModuleEnum.APPLICATIONS]: {
       [RoleEnum.MANAGER]: [applicationSection],
       [RoleEnum.ADMINISTRATOR]: [applicationSection],
     }, */
    [ModuleEnum.STORAGE]: {
      [RoleEnum.OPERATOR]: [scaleControlSection],
    },
  },
};
