import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";

export type VehicleDataStepProps = {
  register: UseFormRegister<GateEntryFormValues>;
  errors: FieldErrors<GateEntryFormValues>;
};
