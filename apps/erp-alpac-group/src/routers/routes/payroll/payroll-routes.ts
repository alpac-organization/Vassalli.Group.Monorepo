import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { CircleMinus, DollarSign, FileClock, Fingerprint, FolderClock, HandCoins, History, UsersRound } from "lucide-react";

export const getPayrollRoutes = () => {

   const collboratorSection: SidebarLink = {
      id: "collaborators",
      label: "Colaboradores",
      path: "collaborators",
      icon: UsersRound,
      allowsRubRoutes: true
   };

   const gestionPayrollSection: SidebarLink = {
      id: "gestion-payroll",
      label: "Gestión de Nómina",
      path: "gestion-nomina",
      icon: DollarSign,
   };

   const payrollPeriodsHistorySection: SidebarLink = {
      id: "historial-periodos-nómina",
      label: "Períodos de Nómina",
      path: "historial-periodos-nomina",
      icon: History,
      allowsRubRoutes: true
   };

   const applicationFromPayrollSection: SidebarLink = {
      id: "applications",
      label: "Solicitudes de Permisos",
      path: "applications",
      icon: FileClock,
   };

   const activeDeductionSection: SidebarLink = {
      id: "active-deductions",
      label: "Deducciones Activas",
      path: "active-deductions",
      icon: CircleMinus,
   };

   const liquidacionSection: SidebarLink = {
      id: "liquidacion",
      label: "Proceso de Liquidación",
      path: "liquidacion",
      icon: HandCoins,
   };

   const attendanceControlSection: SidebarLink = {
      id: "control-asistencia",
      label: "Control de Asistencia",
      path: "control-asistencia",
      icon: Fingerprint,
   };

   const subsidyHistorialSection: SidebarLink = {
      id: "subsidy-history",
      label: "Historial de Subsidio",
      path: "subsidy-history",
      icon: FolderClock
   }

   return {
      collboratorSection,
      gestionPayrollSection,
      payrollPeriodsHistorySection,
      applicationFromPayrollSection,
      activeDeductionSection,
      liquidacionSection,
      attendanceControlSection,
      subsidyHistorialSection
   }
}