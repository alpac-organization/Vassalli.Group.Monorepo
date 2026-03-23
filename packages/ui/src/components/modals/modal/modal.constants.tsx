import { ModalVariant, ModalVariantConfig } from "./modal.type";
import { CheckCircle2, AlertTriangle, XCircle, Info, Bell } from "lucide-react";

export const MODAL_VARIANTS: Record<ModalVariant, ModalVariantConfig> = {
  default: {
    icon: {
      Icon: <Bell size={26} strokeWidth={1.8} />,
      label: "Notificación",
    },
    bgClass: "bg-white",
    textClass: "text-slate-800",
    borderClass: "border-slate-200",
    iconTextClass: "text-slate-500",
  },
  success: {
    icon: {
      Icon: <CheckCircle2 size={26} strokeWidth={1.8} />,
      label: "Éxito",
    },
    bgClass: "bg-white",
    textClass: "text-slate-800",
    borderClass: "border-green-200",
    iconTextClass: "text-green-600",
  },
  warning: {
    icon: {
      Icon: <AlertTriangle size={26} strokeWidth={1.8} />,
      label: "Advertencia",
    },
    bgClass: "bg-white",
    textClass: "text-slate-800",
    borderClass: "border-amber-200",
    iconTextClass: "text-amber-500",
  },
  error: {
    icon: {
      Icon: <XCircle size={26} strokeWidth={1.8} />,
      label: "Error",
    },
    bgClass: "bg-white",
    textClass: "text-slate-800",
    borderClass: "border-red-200",
    iconTextClass: "text-red-500",
  },
  info: {
    icon: {
      Icon: <Info size={26} strokeWidth={1.8} />,
      label: "Información",
    },
    bgClass: "bg-white",
    textClass: "text-slate-800",
    borderClass: "border-blue-200",
    iconTextClass: "text-blue-500",
  },
};
