import type { DocumentType as DocumentEnumType } from "@app/core/enums/document.enum";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";

export type VehicleDataStepProps = {
  register: UseFormRegister<GateEntryFormValues>;
  setValue: UseFormSetValue<GateEntryFormValues>;
  watch: UseFormWatch<GateEntryFormValues>;
  errors: FieldErrors<GateEntryFormValues>;
  documentType: DocumentEnumType;
  onChangeDocumentType: (type: DocumentEnumType) => void;
};
