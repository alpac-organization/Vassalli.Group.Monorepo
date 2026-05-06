import type { GeneratedDocumentType } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
import type { ElementType } from "react";
export interface GenerateDocumentsSectionProps {
  onGenerateDocument: (documentType: GeneratedDocumentType) => void;
  isGenerating: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
}

export type DocumentOption = {
  label: string;
  value: GeneratedDocumentType;
  icon?: ElementType;
};
