import { RoleEnum } from "@app/core/enums/role.enum";
import { ModuleEnum } from "@app/core/enums/module.enum";
import {
  UsersRound,
  User,
  UserKey,
  FileClock,
  DollarSign,
  CircleMinus,
  HandCoins,
  History,
  Scale,
  Users,
  BadgeCent,
  Grid,
  Briefcase,
  Fingerprint,
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

const activeDeductionSection: SidebarLink = {
  id: "active-deductions",
  label: "Deducciones Activas",
  path: "payroll/active-deductions",
  icon: CircleMinus,
};

const attendanceControlSection: SidebarLink = {
  id: "control-asistencia",
  label: "Control de Asistencia",
  path: "payroll/control-asistencia",
  icon: Fingerprint,
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

const administrationCostCentersSection: SidebarLink = {
  id: "cost-centers",
  label: "Centros de Costos",
  path: "administration/cost-centers",
  icon: BadgeCent,
};

const administrationAreasSection: SidebarLink = {
  id: "areas",
  label: "Áreas",
  path: "administration/areas",
  icon: Grid,
};

const administrationJobPositionsSection: SidebarLink = {
  id: "job-positions",
  label: "Puestos de Trabajo",
  path: "administration/job-positions",
  icon: Briefcase,
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
        activeDeductionSection,
        liquidacionSection,
        //   controlVacationsSection,
        attendanceControlSection,
      ],
    },
    [ModuleEnum.ADMINISTRATION]: {
      [RoleEnum.ADMINISTRATOR]: [
        administrationUsersSection,
        administrationCostCentersSection,
        administrationAreasSection,
        administrationJobPositionsSection,
      ],
    },
    [ModuleEnum.WORK_MANAGEMENT]: {
      [RoleEnum.OPERATOR]: [
        collaboratorProfileSection,
        permissionManagementSection,
      ],
      [RoleEnum.MANAGER]: [
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
