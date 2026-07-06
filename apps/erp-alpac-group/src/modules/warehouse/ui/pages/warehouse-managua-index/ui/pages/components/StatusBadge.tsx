import { Badges } from "@alpac/design-system";

export const StatusBadge = ({ status }: { status: string }) => {
  const getColors = () => {
    switch (status) {
      case 'en_puerta': return "bg-blue-100 text-blue-800";
      case 'en_patio': return "bg-amber-100 text-amber-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };
  return <Badges label={status.toUpperCase()} color="transparent" className={getColors()} />;
};