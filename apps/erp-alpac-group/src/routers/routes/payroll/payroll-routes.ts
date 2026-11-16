import type { SidebarLink } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { CircleMinus, DollarSign, FileClock, Fingerprint, FolderClock, HandCoins, History, UsersRound, ShieldCheck, Scale } from "lucide-react";

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

   const gestionDisciplinariaSection: SidebarLink = {
      id: "disciplinary-management",
      label: "Régimen Disciplinario",
      path: "disciplinary-management",
      icon: Scale,
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
   const permissionPoliciesSection: SidebarLink = {
      id: "permission-policies",
      label: "Políticas de Permisos",
      path: "permission-policies",
      icon:  ShieldCheck 
   }

   return {
      collboratorSection,
      gestionPayrollSection,
      gestionDisciplinariaSection,
      payrollPeriodsHistorySection,
      applicationFromPayrollSection,
      activeDeductionSection,
      liquidacionSection,
      attendanceControlSection,
      subsidyHistorialSection,
      permissionPoliciesSection
   }
}