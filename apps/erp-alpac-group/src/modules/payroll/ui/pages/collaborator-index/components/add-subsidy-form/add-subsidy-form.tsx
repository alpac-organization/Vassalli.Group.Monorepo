import { Button, DatePicker, Dropdown, InputText, Textarea } from "@alpac/design-system";

const inputClassName = "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const SUBSIDY_TYPE_OPTIONS = [
   { value: "common_illness", label: "Enfermedad Común" },
   { value: "work_accident", label: "Accidente Laboral" },
   { value: "maternity", label: "Maternidad" },
];

export const AddSubsidyForm = () => {
   return (
      <form onSubmit={(e) => e.preventDefault()}
         className="flex min-w-0 flex-col gap-4 sm:gap-5"
      >

         {/* ── Sección: Tipo de Subsidio ── */}
         <div className="flex flex-col gap-1.5">
            <Dropdown
               label="Tipo de subsidio"
               placeholder="Seleccione el tipo de subsidio"
               appearance="dark"
               isRequired
               labelClassName={labelClassName}
               valueClassName={labelClassName}
               className={inputClassName}
               options={SUBSIDY_TYPE_OPTIONS}
               value={undefined}
               onChange={() => { }}
            />
         </div>

         {/* ── Sección: Fechas ── */}
         <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 flex flex-col gap-1.5">
               <DatePicker
                  label="Fecha de inicio"
                  fieldWidth="large"
                  className="w-full"
                  labelAbove
                  isRequired
                  value={null}
                  onChange={() => { }}
               />
            </div>
            <div className="min-w-0 flex flex-col gap-1.5">
               <DatePicker
                  label="Fecha de fin (provisional)"
                  fieldWidth="large"
                  className="w-full"
                  labelAbove
                  isRequired
                  value={null}
                  onChange={() => { }}
               />
            </div>
         </div>



         {/* ── Sección: Datos Médicos ── */}
         <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 flex flex-col gap-1.5">
               <InputText
                  label="Nº de Boleta"
                  placeholder="Ingrese el número de boleta"
                  labelClassName={labelClassName}
                  isRequired
                  className={inputClassName}
               />
            </div>
         </div>

         {/* ── Sección: Observaciones ── */}
         <div className="flex flex-col gap-1.5">
            <Textarea
               label="Observaciones"
               rows={3}
               maxLength={500}
               placeholder="Detalles adicionales del subsidio..."
               labelClassName={labelClassName}
               className={`${inputClassName} resize-none`}
            />
         </div>

         {/* ── Sección: Resumen calculado (solo lectura) ── */}
         <div className="rounded-md border border-slate-300 dark:border-neutral-600 bg-slate-50 dark:bg-[#1e2229] p-4 flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
               Resumen del subsidio
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
               <span className="text-slate-500 dark:text-slate-400">Total de días:</span>
               <span className="text-slate-800 dark:text-white font-medium">—</span>

               <span className="text-slate-500 dark:text-slate-400">Días a cargo del empleador (1–3):</span>
               <span className="text-slate-800 dark:text-white font-medium">— días</span>

               <span className="text-slate-500 dark:text-slate-400">Días a cargo del INSS (día 4+):</span>
               <span className="text-slate-800 dark:text-white font-medium">— días (60%)</span>

               <span className="text-slate-500 dark:text-slate-400">Monto empleador:</span>
               <span className="text-slate-800 dark:text-white font-medium">C$ —</span>

               <span className="text-slate-500 dark:text-slate-400">Monto INSS:</span>
               <span className="text-slate-800 dark:text-white font-medium">C$ —</span>
            </div>
         </div>

         {/* ── Acciones ── */}
         <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>
         <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
               type="button"
               size="giant"
               label="Cancelar"
               onClick={() => { }}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
            />
            <Button
               type="button"
               size="giant"
               label="Registrar Subsidio"
               onClick={() => { }}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </form>
   )
}