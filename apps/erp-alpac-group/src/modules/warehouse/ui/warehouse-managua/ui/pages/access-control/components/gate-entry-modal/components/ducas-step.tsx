import { Button, InputText } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import { Trash2Icon, AlertTriangleIcon } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { FieldArrayWithId, UseFormRegister } from "react-hook-form";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import {
  getScrollParent,
  ENTER_ANIMATION_MS,
  ducaItemVariants,
  pinScrollToBottom,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/scroll-modal.ducat";
import {
  gateEntryInputClassName,
  gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";

type DucasStepProps = {
  fields: FieldArrayWithId<GateEntryFormValues, "ducas", "id">[];
  register: UseFormRegister<GateEntryFormValues>;
  onRemove: (index: number) => void;
};

export function DucasStep({
  fields,
  register,
  onRemove,
}: DucasStepProps) {
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(fields.length);

  useLayoutEffect(() => {
    const didAdd = fields.length > prevCountRef.current;
    prevCountRef.current = fields.length;

    if (!didAdd || !lastItemRef.current) return;

    const scrollParent = getScrollParent(lastItemRef.current);
    if (!scrollParent) return;

    pinScrollToBottom(scrollParent);

    const startedAt = performance.now();
    let frameId = 0;

    const keepPinnedDuringEnter = (now: number) => {
      pinScrollToBottom(scrollParent);

      if (now - startedAt < ENTER_ANIMATION_MS) {
        frameId = window.requestAnimationFrame(keepPinnedDuringEnter);
      }
    };

    frameId = window.requestAnimationFrame(keepPinnedDuringEnter);

    return () => window.cancelAnimationFrame(frameId);
  }, [fields.length]);

  if (fields.length === 0) {
    return (
      <div className="space-y-2 px-1 bg-red-900/55 border-l-4 border-red-500/60 rounded-md">
        <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-300 text-center py-6 sm:py-4 flex flex-col items-center gap-2">
          <AlertTriangleIcon size={28} />
          No hay DUCAs agregadas. Use &quot;Agregar Duca&quot; para continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-4">
      <AnimatePresence initial={false} mode="popLayout">
        {fields.map((field, index) => {
          const isLast = index === fields.length - 1;
          return (
            <m.div
              key={field.id}
              ref={isLast ? lastItemRef : undefined}
              layout
              variants={ducaItemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-2 sm:gap-1.5 min-w-0 overflow-hidden"
            >
              <label
                className={`text-[13px] sm:text-[14px] font-medium ml-0.5 ${gateEntryLabelClassName}`}
              >
                {`Documento DUCA #${index + 1}`}
              </label>
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="flex-1 min-w-0 p-1.5 sm:p-2">
                  <InputText
                    className={gateEntryInputClassName}
                    {...register(`ducas.${index}.value` as const)}
                  />
                </div>
                <Button
                  type="button"
                  size="medium"
                  onClick={() => onRemove(index)}
                  className="shrink-0! h-9! w-9! min-w-9! p-0! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  icon={<Trash2Icon size={16} />}
                  ariaLabel={`Eliminar DUCA ${index + 1}`}
                />
              </div>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
