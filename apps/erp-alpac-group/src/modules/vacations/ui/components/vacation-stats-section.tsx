import { StatsCard } from "@alpac/design-system";
import { CalendarCheck, CalendarDays } from "lucide-react";

type VacationStatsSectionProps = {
  /** Días ya gozados — TODO: origen API */
  daysTakenDisplay: string;
  /** Días de vacaciones restantes — TODO: origen API */
  daysRemainingDisplay: string;
};

export function VacationStatsSection({
  daysTakenDisplay,
  daysRemainingDisplay,
}: VacationStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatsCard
        title="Cantidad gozadas"
        value={daysTakenDisplay}
        icon={<CalendarCheck size={28} />}
        borderColor="border-blue-600! dark:border-blue-400!"
      />
      <StatsCard
        title="Días de vacaciones restantes"
        value={daysRemainingDisplay}
        icon={<CalendarDays size={28} />}
        borderColor="border-green-800! dark:border-green-600!"
      />
    </div>
  );
}
