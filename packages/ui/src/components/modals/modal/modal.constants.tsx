import { ModalSize, ModalVariant, ModalVariantConfig } from "./modal.type";
import { CheckCircle2, AlertTriangle, XCircle, Info, Bell, Form } from "lucide-react";

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
  form: {
    icon: {
      Icon: <Form size={26} strokeWidth={1.8} />,
      label: "Formulario",
    },
    bgClass: "bg-white",
    textClass: "text-slate-800",
    borderClass: "border-blue-200",
    iconTextClass: "text-slate-500",
  },
};

export const MODAL_SIZES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  "8xl": "max-w-8xl",
  "9xl": "max-w-9xl",
  full: "max-w-full",
};
