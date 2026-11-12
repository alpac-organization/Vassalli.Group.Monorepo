import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateCollaboratorProfileDetailsRequest extends BaseRequest {
  
  /*
   * Numero de identificación del colaborador
   * @example "001-120395-0000X"
   * @required
   */
  identification_number: string;
  first_name?: string;
  second_name?: string;
  third_name?: string;
  first_surname?: string;
  second_surname?: string;
  personal_information?: UpdatePersonalInformationRequest;
  working_information?: UpdateWorkingInformationRequest;
  code_collaborator?: string;
  // salary_information?: UpdateSalaryInformationRequest;
}
export interface UpdatePersonalInformationRequest {
  address?: string;
  personal_email?: string;
  personal_phone_number?: string;
  marital_status?: number;
  departament_id?: number;
}
export interface UpdateWorkingInformationRequest {
  work_email?: string;
  work_phone_number?: string;
  branch_id?: string;
  bank_id?: string;
  inss_number?: string;
  bank_account_number?: string; 
}
// export interface UpdateSalaryInformationRequest {
//   salary?: number;
//   currency?: string | number;
//   salary_type?: number;
// }
