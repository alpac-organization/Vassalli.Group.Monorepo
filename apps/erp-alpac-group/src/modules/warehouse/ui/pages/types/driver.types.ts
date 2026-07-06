type DriverStatus = 'exit' | 'entry' | 'waiting';

export interface DriverRecord {
   id: number;
   identification_number: string;
   licensePlate: string;
   driverName: string;
   status: DriverStatus;
   arrivalTime: string;
   action: string;
   custumer: string;
   product: string;
   package_number: number;
   arrived_time: string;
   exit_time: string;
   entry_number: number;
   exit_number: number;
}

export type ScaleStatus = "pending" | "in_progress" | "completed";

export interface ScaleRecord {
   id: number;
   identification_number: string;
   licensePlate: string;
   driverName: string;
   status: ScaleStatus;
   date: string;
   start_time?: string;
   end_time?: string;
}

export const SCALE_STATUS_LABELS: Record<ScaleStatus, string> = {
   pending: "Pendiente",
   in_progress: "En basculaje",
   completed: "Completado",
};

export const getScaleStatusBadgeColor = (status: ScaleStatus): string => {
   switch (status) {
      case "pending":
         return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
      case "in_progress":
         return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
      case "completed":
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
      default:
         return "bg-slate-100 text-slate-800";
   }
};

export const getScaleStatusActionLabel = (status: ScaleStatus): string => {
   switch (status) {
      case "pending":
         return "Iniciar basculaje";
      case "in_progress":
         return "Continuar basculaje";
      case "completed":
         return "Ver ticket";
      default:
         return "Ver detalle";
   }
};

export const getScaleStatusButtonColor = (status: ScaleStatus): string => {
   switch (status) {
      case "pending":
      case "in_progress":
         return "text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
      case "completed":
         return "text-[13px]! text-emerald-800! bg-emerald-100! dark:text-emerald-200! dark:bg-emerald-900/60!";
      default:
         return "text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
   }
};

export const STATUS_LABELS: Record<DriverRecord["status"], string> = {
   exit: "Dentro",
   entry: "Salio",
   waiting: "En espera"
};

export const getStatusBadgeColor = (status: DriverRecord["status"]): string => {
   switch (status) {
      case "entry":
         return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
      case "exit":
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
      case "waiting":
         return "bg-emerald-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
      default:
         return "bg-slate-100 text-slate-800";
   }
};

export const getStatusButtonColor = (status: DriverRecord["status"]): string => {
   switch (status) {
      case "entry":
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200";
      case "exit":
         return "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200";
      default:
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200";
   }
};