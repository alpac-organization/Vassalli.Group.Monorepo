import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export type BannerVariant = "info" | "warning" | "error" | "success";

export interface BannerProps {
   variant?: BannerVariant;
   title: string;
   description: string | ReactNode;
}

export const variants: Record<BannerVariant, any> = {
   info: {
      base: "border-blue-500/20 from-blue-500/10",
      iconBg: "bg-blue-500/20 text-blue-400",
      title: "text-blue-400",
      icon: Info,
   },
   warning: {
      base: "border-amber-500/20 from-amber-500/10",
      iconBg: "bg-amber-500/20 text-amber-400",
      title: "text-amber-400",
      icon: AlertTriangle,
   },
   error: {
      base: "border-red-500/20 from-red-500/10",
      iconBg: "bg-red-500/20 text-red-400",
      title: "text-red-400",
      icon: AlertCircle,
   },
   success: {
      base: "border-emerald-500/20 from-emerald-500/10",
      iconBg: "bg-emerald-500/20 text-emerald-400",
      title: "text-emerald-400",
      icon: CheckCircle2,
   },
};