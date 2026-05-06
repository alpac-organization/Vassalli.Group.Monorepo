import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { CollaboratorProfileDocumentEnum } from "@app/modules/payroll/domain/enums/collaborator-enums/collaborator-profile-documents";
import type { GeneratedDocumentType } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
import type { DocumentOption } from "@app/modules/payroll/ui/pages/collaborator-profile/components/generate-documents/types/generate-document.type";
import { FileText, Receipt } from "lucide-react";

const DOCUMENT_ICONS_BY_TYPE: Record<GeneratedDocumentType, DocumentOption["icon"]> =
  {
    LetterCollaboratorActive: FileText,
    SalaryLetter: Receipt,
  };

export const DOCUMENT_OPTIONS: DocumentOption[] = (
  Object.keys(CollaboratorProfileDocumentEnum) as GeneratedDocumentType[]
).map((type) => ({
  label: CollaboratorProfileDocumentEnum[type].label,
  value: CollaboratorProfileDocumentEnum[type].value,
  icon: DOCUMENT_ICONS_BY_TYPE[type],
}));
export type FeedbackAlert = {
  type: "success" | "error";
  title: string;
  message: string;
};

export function getDocumentGenerationErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "error" in error) {
    const apiError = error as ApiErrorResponse;
    return (
      apiError.error?.description ?? "Ocurrió un error al generar el documento."
    );
  }

  return "Ocurrió un error al generar el documento.";
}
