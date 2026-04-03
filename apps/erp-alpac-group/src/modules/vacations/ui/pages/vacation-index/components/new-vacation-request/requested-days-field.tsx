type RequestedDaysFieldProps = {
  days: number;
};

export function RequestedDaysField({ days }: RequestedDaysFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[14px] font-medium text-slate-600 dark:text-slate-300 ml-0.5">
        Días solicitados
      </span>
      <span
        className={`text-2xl font-bold ${
          days > 0
            ? "text-alpac-primary-500 dark:text-alpac-primary-400"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {days}
      </span>
    </div>
  );
}
