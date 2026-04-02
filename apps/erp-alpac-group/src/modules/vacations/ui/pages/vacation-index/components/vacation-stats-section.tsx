import { StatsCard } from "@alpac/design-system";
import { CalendarCheck, CalendarDays, Luggage } from "lucide-react";

type VacationStatsSectionProps = {
  daysTakenDisplay: string;
  daysRemainingDisplay: string;
  daysGeneratedDisplay: string;
};

export function VacationStatsSection({
  daysTakenDisplay,
  daysRemainingDisplay,
  daysGeneratedDisplay,
}: VacationStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Cantidad gozadas"
        value={daysTakenDisplay}
        icon={<CalendarCheck size={30} />}
        borderColor="border-blue-600! dark:border-blue-400!"
      />
      <StatsCard
        title="Días de vacaciones restantes"
        value={daysRemainingDisplay}
        icon={<CalendarDays size={30} />}
        borderColor="border-green-800! dark:border-green-600!"
      />
      <StatsCard
        title="Días de vacaciones generadas"
        value={daysGeneratedDisplay}
        icon={<Luggage size={30} />}
        borderColor="border-red-500! dark:border-red-500!"
      />
    </div>
  );
}
