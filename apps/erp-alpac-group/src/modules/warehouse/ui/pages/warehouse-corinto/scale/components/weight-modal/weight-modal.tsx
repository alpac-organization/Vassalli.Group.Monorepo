import { Button, Modal } from "@alpac/design-system";
import { formatTime } from "@app/shared/utils/string.utils";
import { User, WeightTildeIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { WeightModalProps, WeightStageCardProps } from "./weight-modal.types";
import { formatWeight } from "./utils/scale.utils";

const INITIAL_TARA_KG = 12_500;
const SCALE_ID = "BASC-00942-X8";
const SCALE_NUMBER = "04";

const getTrailerPlate = (licensePlate: string) => {
   const suffix = licensePlate.replace(/\s/g, "").slice(-3).toUpperCase();
   return `R-${suffix}-XZ`;
};

export const WeightModal = ({ isOpen, onClose, record }: WeightModalProps) => {
   const [liveWeight, setLiveWeight] = useState(42_305);
   const [initialWeight, setInitialWeight] = useState<number | null>(INITIAL_TARA_KG);
   const [finalWeight, setFinalWeight] = useState<number | null>(null);
   const [initialRegisteredAt, setInitialRegisteredAt] = useState<string | null>(null);

   useEffect(() => {
      if (!isOpen || !record) return;

      setLiveWeight(42_305);
      setInitialWeight(INITIAL_TARA_KG);
      setFinalWeight(null);
      setInitialRegisteredAt(record.start_time ?? null);
   }, [isOpen, record]);

   const estimatedNet = useMemo(() => {
      if (initialWeight == null) return null;
      const gross = finalWeight ?? liveWeight;
      return Math.max(gross - initialWeight, 0);
   }, [finalWeight, initialWeight, liveWeight]);

   const handleGetCurrentWeight = () => {
      const nextWeight = 42_000 + Math.floor(Math.random() * 800);
      setLiveWeight(nextWeight);

      if (initialWeight == null) {
         setInitialWeight(nextWeight);
         setInitialRegisteredAt(new Date().toISOString());
         return;
      }

      if (finalWeight == null) {
         setFinalWeight(nextWeight);
      }
   };

   if (!record) return null;

   const operatorName = record.driverName.toUpperCase();
   const trailerPlate = getTrailerPlate(record.licensePlate);

   return (
      <Modal
         isOpen={isOpen}
         variant="form"
         onClose={onClose}
         size="6xl"
      >
         <div className="flex flex-col">

            <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
               <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <h2 className="m-0! text-base! font-bold tracking-wide text-white uppercase sm:text-lg!">
                     Control de Pesaje de Carga
                  </h2>
               </div>

               <Button
                  type="button"
                  label="Obtener Peso Actual"
                  size="medium"
                  onClick={handleGetCurrentWeight}
                  className="rounded-md! border-0! bg-emerald-600! px-4! text-white! hover:bg-emerald-500! dark:bg-emerald-600! dark:hover:bg-emerald-500!"
                  icon={<WeightTildeIcon size={18} />}
               />
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
               <section className="flex flex-col gap-5">
                  <div>
                     <p className="m-0! mb-1! text-[11px]! font-semibold tracking-wider text-slate-500 uppercase">
                        Nombre del Operador
                     </p>
                     <p className="m-0! text-lg! font-semibold text-white uppercase">
                        {operatorName}
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                     <div>
                        <p className="m-0! mb-1.5! text-[11px]! font-semibold tracking-wider text-slate-500 uppercase">
                           Placa Rastra
                        </p>
                        <div className="rounded-md border border-slate-600 bg-[#272b34] px-3 py-2.5 text-sm font-medium text-white">
                           {record.licensePlate}
                        </div>
                     </div>

                     <div>
                        <p className="m-0! mb-1.5! text-[11px]! font-semibold tracking-wider text-slate-500 uppercase">
                           Placa Remolque
                        </p>
                        <div className="rounded-md border border-slate-600 bg-[#272b34] px-3 py-2.5 text-sm font-medium text-white">
                           {trailerPlate}
                        </div>
                     </div>                     

                  </div>

                  <div>
                     <p className="m-0! mb-2! text-[11px]! font-semibold tracking-wider text-slate-500 uppercase">
                        Estado Actual
                     </p>
                     <span className="inline-flex rounded-full border border-amber-500/70 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-400 uppercase">
                        En Proceso de Carga
                     </span>
                  </div>

                  <div className="mt-auto rounded-lg border border-slate-700 bg-[#272b34] p-4">
                     <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-600 bg-[#1c2029] text-slate-300">
                           <User size={18} />
                        </div>
                        <div>
                           <p className="m-0! text-sm! font-semibold text-white">Licencia Tipo A</p>
                           <p className="m-0! text-xs! text-slate-400">Vence: 12/2025</p>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="flex flex-col gap-4">

                  <div className="rounded-xl border border-emerald-500/30 bg-[#272b34] p-5">
                     <p className="m-0! mb-2! text-[11px]! font-semibold tracking-wider text-emerald-400 uppercase">
                        Pesaje en Vivo (Báscula {SCALE_NUMBER})
                     </p>
                     <p className="m-0! font-mono text-4xl! font-bold text-emerald-400 sm:text-5xl!">
                        {formatWeight(liveWeight)}
                     </p>
                  </div>

                  <WeightStageCard
                     accent="blue"
                     label="Peso Inicial (Tara)"
                     value={initialWeight != null ? formatWeight(initialWeight) : "Pendiente..."}
                     meta={
                        initialRegisteredAt
                           ? `Registrado ${formatTime(initialRegisteredAt)}`
                           : undefined
                     }
                     isPending={initialWeight == null}
                  />

                  <WeightStageCard
                     accent="amber"
                     label="Peso Final (Bruto)"
                     value={finalWeight != null ? formatWeight(finalWeight) : "Pendiente..."}
                     meta={finalWeight == null ? "En espera" : `Registrado ${formatTime(record.end_time)}`}
                     isPending={finalWeight == null}
                  />

                  <WeightStageCard
                     accent="emerald"
                     label="Total Neto Estimado"
                     value={estimatedNet != null ? formatWeight(estimatedNet) : "—"}
                     meta="Carga óptima"
                     subMeta="Dentro de tolerancia"
                     highlighted
                  />
               </section>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 mt-4">
               <p className="m-0! text-[11px]! tracking-wide text-slate-500 uppercase">
                  ST-ID: {SCALE_ID} | Sync OK | Secure Channel
               </p>

               <div className="flex items-center gap-3">
               
                  <Button
                     type="button"
                     label="Cancelar"
                     size="medium"
                     onClick={onClose}
                     className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
                  />
                  <Button
                     type="button"
                     label="Imprimir Ticket"
                     size="medium"
                     onClick={() => { }}
                     className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
                  />
               </div>
            </footer>
         </div>
      </Modal>
   );
};

const WeightStageCard = ({
   label,
   value,
   meta,
   subMeta,
   isPending = false,
   highlighted = false,
}: WeightStageCardProps) => (
   <div
      className={`rounded-lg border border-slate-700 bg-[#272b34] p-4 ${highlighted ? "shadow-[0_0_20px_-8px_rgba(52,211,153,0.5)]" : ""}`}
   >
      <div className="flex items-start justify-between gap-4">
         <div>
            <p className="m-0! mb-1! text-[11px]! font-semibold tracking-wider text-slate-400 uppercase">
               {label}
            </p>
            <p
               className={`m-0! text-2xl! font-mono font-semibold ${isPending ? "text-slate-500 italic" : highlighted ? "text-emerald-400" : "text-white"}`}
            >
               {value}
            </p>
         </div>

         {meta && (
            <div className="text-right">
               <p className={`m-0! text-[11px]! uppercase ${highlighted ? "text-emerald-400" : "text-slate-500"}`}>
                  {meta}
               </p>
               {subMeta && (
                  <p className="m-0! text-[11px]! text-emerald-400 uppercase">{subMeta}</p>
               )}
            </div>
         )}
      </div>
   </div>
);
