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
  Users,
  BadgeCent,
  Grid,
  Briefcase,
  Fingerprint,
  TruckIcon,
  WeightTildeIcon,
  FilePenIcon,
  ShieldCheckIcon,
  ArchiveRestoreIcon,
  FolderClock,
  WarehouseIcon,
} from "lucide-react";

import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

const collboratorSection: SidebarLink = {
  id: "collaborators",
  label: "Colaboradores",
  path: "payroll/collaborators",
  icon: UsersRound,
  allowsRubRoutes: true
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
  allowsRubRoutes: true
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

const warehouseCorintoSection: SidebarLink = {
  id: "warehouse-corinto",
  label: "Panel Logístico",
  path: "warehouse-corinto",
  icon: TruckIcon,
};

const warehouseManaguaSection: SidebarLink = {
  id: "warehouse-managua",
  label: "Panel Logístico",
  path: "warehouse",
  icon: TruckIcon,
};

const accessControlSection: SidebarLink = {
  id: "access-control",
  label: "Control de acceso",
  path: "warehouse-corinto/access",
  icon: ShieldCheckIcon,
};

const scaleSection: SidebarLink = {
  id: "scale",
  label: "Basculaje",
  path: "warehouse-corinto/scale",
  icon: WeightTildeIcon,
};

const warehouseReportSection: SidebarLink = {
  id: "warehouse3",
  label: "Reportes",
  path: "warehouse/reports",
  icon: FilePenIcon,
};

const warehouseSection1: SidebarLink = {
  id: "warehouse4",
  label: "Ingreso Mercancía",
  path: "warehouse/section1",
  icon: ArchiveRestoreIcon,
};

const warehouseSection4: SidebarLink = {
  id: "warehouse7",
  label: "Asignaciones de Inventario",
  path: "warehouse/section4",
  icon: FilePenIcon,
};

const warehouseSection12: SidebarLink = {
  id: "warehouse15",
  label: "Cuadrillas",
  path: "warehouse/section12",
  icon: FilePenIcon,
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

const subsidyHistorialSection: SidebarLink = {
  id: "subsidy-history",
  label: "Historial de Subsidio",
  path: "payroll/subsidy-history",
  icon: FolderClock
}

const receivingSection: SidebarLink = {
  id: "receiving",
  label: "Bodega",
  path: "warehouse-corinto/receiving",
  icon: WarehouseIcon
}

export const sidebarData = {
  navigationRegistry: {
    [ModuleEnum.PAYROLL]: {
      [RoleEnum.ADMINISTRATOR]: [
        collboratorSection,
        gestionPayrollSection,
        payrollPeriodsHistorySection,
        applicationFromPayrollSection,
        activeDeductionSection,
        liquidacionSection,
        attendanceControlSection,
        subsidyHistorialSection
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
    [ModuleEnum.WAREHOUSE_CORINTO]: {
      [RoleEnum.OPERATOR]: [
        warehouseCorintoSection,
        accessControlSection,
        scaleSection,
        receivingSection,
        warehouseReportSection,
      ],
    },
    [ModuleEnum.WAREHOUSE_MANAGUA]: {
      [RoleEnum.OPERATOR]: [
        warehouseManaguaSection,
        warehouseSection1,
        warehouseSection4,
        warehouseSection12,
        warehouseReportSection,
      ],
    },
  },
};
