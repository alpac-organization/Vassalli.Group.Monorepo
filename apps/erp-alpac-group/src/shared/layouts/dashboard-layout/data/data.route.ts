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

const warehouseCorintoSection: SidebarLink = {
  id: "warehouse-corinto",
  label: "Panel Logístico",
  path: "warehouse",
  icon: TruckIcon,
};

const warehouseManaguaSection: SidebarLink = {
  id: "warehouse-managua",
  label: "Panel Logístico",
  path: "warehouse",
  icon: TruckIcon,
};

const accessControlSection: SidebarLink = {
  id: "warehouse1",
  label: "Control de acceso",
  path: "warehouse/access",
  icon: ShieldCheckIcon,
};

const weighingSection: SidebarLink = {
  id: "warehouse2",
  label: "Basculaje",
  path: "warehouse/weighing",
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



const warehouseSection2: SidebarLink = {
  id: "warehouse5",
  label: "Documentos Registrados",
  path: "warehouse/section2",
  icon: FilePenIcon,
};

const warehouseSection3: SidebarLink = {
  id: "warehouse6",
  label: "Salidas",
  path: "warehouse/section3",
  icon: FilePenIcon,
};

const warehouseSection4: SidebarLink = {
  id: "warehouse7",
  label: "Asignaciones de Inventario",
  path: "warehouse/section4",
  icon: FilePenIcon,
};

const warehouseSection5: SidebarLink = {
  id: "warehouse8",
  label: "Reporte de Liquidación Actividades",
  path: "warehouse/section5",
  icon: FilePenIcon,
};

const warehouseSection6: SidebarLink = {
  id: "warehouse9",
  label: "Edición de Cardex",
  path: "warehouse/section6",
  icon: FilePenIcon,
};

const warehouseSection7: SidebarLink = {
  id: "warehouse10",
  label: "Registrar actividades horarias",
  path: "warehouse/section7",
  icon: FilePenIcon,
};

const warehouseSection8: SidebarLink = {
  id: "warehouse11",
  label: "Reporte de Inventario",
  path: "warehouse/section8",
  icon: FilePenIcon,
};

const warehouseSection9: SidebarLink = {
  id: "warehouse12",
  label: "Informe de Validación",
  path: "warehouse/section9",
  icon: FilePenIcon,
};

const warehouseSection10: SidebarLink = {
  id: "warehouse13",
  label: "Asignaciones de Embarque",
  path: "warehouse/section10",
  icon: FilePenIcon,
};

const warehouseSection11: SidebarLink = {
  id: "warehouse14",
  label: "Actividad de Liquidación",
  path: "warehouse/section11",
  icon: FilePenIcon,
};

const warehouseSection12: SidebarLink = {
  id: "warehouse15",
  label: "Cuadrillas",
  path: "warehouse/section12",
  icon: FilePenIcon,
};

const warehouseSection13: SidebarLink = {
  id: "warehouse16",
  label: "Ingreso Producto",
  path: "warehouse/section13",
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
    /*  [ModuleEnum.APPLICATIONS]: {
       [RoleEnum.MANAGER]: [applicationSection],
       [RoleEnum.ADMINISTRATOR]: [applicationSection],
     }, */
    [ModuleEnum.WAREHOUSE_CORINTO]: {
      [RoleEnum.OPERATOR]: [
        warehouseCorintoSection,
        accessControlSection,
        weighingSection,
        
        
        //warehouseSection1,
        // warehouseSection2,
        warehouseSection13,
        
        // warehouseSection3,
        warehouseSection4,
        warehouseSection12,
        /*warehouseSection5,
        warehouseSection6,
        warehouseSection7,
        warehouseSection8,
        warehouseSection9,
        warehouseSection10,
        warehouseSection11*/
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
