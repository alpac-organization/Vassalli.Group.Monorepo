import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { type TransportDocumentType, type DocumentType as DocumentEnumType } from "@app/core/enums/document.enum";

export type VehicleDataStepProps = {
  register: UseFormRegister<GateEntryFormValues>;
  setValue: UseFormSetValue<GateEntryFormValues>;
  errors: FieldErrors<GateEntryFormValues>;
  documentType: DocumentEnumType;
  onChangeDocumentType: (type: TransportDocumentType) => void;
};
