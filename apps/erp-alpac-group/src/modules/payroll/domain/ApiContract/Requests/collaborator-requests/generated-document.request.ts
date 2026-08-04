import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetCollaboratorProfileGeneratedDocumentParams extends BaseRequest {
  identification_number: string;
  document_type: GeneratedDocumentType;
}
export type GeneratedDocumentType = "LetterCollaboratorActive" | "SalaryLetter";
