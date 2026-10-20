import { AccordionItem, Button, InputText, Textarea } from "@alpac/design-system"
import { Controller, useFormContext } from "react-hook-form";
import { inputClassName, labelClassName } from "../../../../utils/styles";

import type { MerchandiseItemProps } from "./merchandise-item.types"
import type { UpdateReceptionInfoFormValues } from "../../types/update-reception-info-modal.types";
import { Trash2Icon } from "lucide-react";

export const MerchandiseItem = ({ merchandiseItemIndex, accordionValue, onRemove }: MerchandiseItemProps) => {

   const {
      control,
      watch,
   } = useFormContext<UpdateReceptionInfoFormValues>();

   return (
      <div key={accordionValue} className="relative">

         <AccordionItem
            value={accordionValue}
            className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
            triggerClassName="h-auto! min-h-12! py-2.5! pr-3!"
            contentClassName="flex flex-col gap-4 p-4"
            title={
               <div className="flex min-w-0 items-center gap-3 pr-12">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
                     {merchandiseItemIndex + 1}
                  </span>
                  <span className="min-w-0 truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                     {watch(`merchandises.${merchandiseItemIndex}.merchandise`) ||
                        `Mercancía #${merchandiseItemIndex + 1}`}
                  </span>
               </div>
            }
         >
            <div className="grid grid-cols-1 gap-4">
               <Controller
                  name={`merchandises.${merchandiseItemIndex}.merchandise`}
                  control={control}
                  render={({ field }) => (
                     <InputText
                        label="Mercancía"
                        labelClassName={labelClassName}
                        placeholder="Nombre de la mercancía"
                        value={field.value || ""}
                        onChange={(e) =>
                           field.onChange(e.target.value)
                        }
                        className={inputClassName}
                     />
                  )}
               />
               <Controller
                  name={`merchandises.${merchandiseItemIndex}.merchandise_description`}
                  control={control}
                  render={({ field }) => (
                     <Textarea
                        label="Descripción"
                        labelClassName={labelClassName}
                        placeholder="Descripción de la mercancía..."
                        rows={3}
                        value={field.value || ""}
                        onChange={(e) =>
                           field.onChange(e.target.value)
                        }
                        className={inputClassName}
                     />
                  )}
               />

            </div>

         </AccordionItem>

         <Button
            type="button"
            size="small"
            tooltip="Quitar mercancía"
            ariaLabel="Quitar mercancía"
            icon={<Trash2Icon size={16} />}
            onClick={() => onRemove(merchandiseItemIndex)}
            className="absolute! top-2.5 right-10 z-10 h-8 w-8! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!"
         />
      </div>

   );
}