import type { FieldArrayWithId, UseFormRegister } from "react-hook-form";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";

export type DucatProps = {
  fields: FieldArrayWithId<GateEntryFormValues, "ducas", "id">[];
  register: UseFormRegister<GateEntryFormValues>;
  onRemove: (index: number) => void;
};
