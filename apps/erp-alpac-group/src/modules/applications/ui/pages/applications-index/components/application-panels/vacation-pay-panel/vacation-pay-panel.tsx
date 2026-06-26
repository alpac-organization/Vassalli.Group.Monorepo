import type { VacationPayPanelProps } from "./vacation-pay-panel.types";

export const VacationPayPanel = ({ application }: VacationPayPanelProps) => {

  return (
    <>
    
      {application.type === "VacationPay" && !!application.amount_days && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Cantidad a Recibir
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {application.amount_days ?? "-"} días 
            </span>
          </div>
        </div>
      )}
    
    </>
  );
};
