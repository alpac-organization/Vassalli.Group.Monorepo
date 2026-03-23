import { ModalVariant, ModalVariantConfig } from "./modal.type";
import { CheckCircle2, AlertTriangle, XCircle, Info, Bell } from "lucide-react";

export const MODAL_VARIANTS: Record<ModalVariant, ModalVariantConfig> = {
  default: {
    icon: {
      Icon: <Bell size={16} strokeWidth={2.5} />,
      label: "Notificación",
    },
    bgClass: "bg-gray-100",
    textClass: "text-gray-600",
  },
  success: {
    icon: {
      Icon: <CheckCircle2 size={16} strokeWidth={2.5} />,
      label: "Éxito",
    },
    bgClass: "bg-green-50",
    textClass: "text-green-500",
  },
  warning: {
    icon: {
      Icon: <AlertTriangle size={16} strokeWidth={2.5} />,
      label: "Advertencia",
    },
    bgClass: "bg-yellow-50",
    textClass: "text-yellow-500",
  },
  error: {
    icon: {
      Icon: <XCircle size={16} strokeWidth={2.5} />,
      label: "Error",
    },
    bgClass: "bg-red-50",
    textClass: "text-red-500",
  },
  info: {
    icon: {
      Icon: <Info size={16} strokeWidth={2.5} />,
      label: "Información",
    },
    bgClass: "bg-blue-50",
    textClass: "text-blue-500",
  },
};
