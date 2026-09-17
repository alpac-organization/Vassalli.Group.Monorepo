import type { Allowance } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-allowance-form/add-allowance-form.types";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AddCollaboratorRequest extends BaseRequest {
  first_name: string;
  second_name?: string;
  third_name?: string;
  first_lastname: string;
  second_lastname?: string;
  identification_number: string;
  identification_type: number;
  does_work_saturday: boolean;
  personal_information: AddPersonalInformationRequest;
  working_information: AddWorkingInformationRequest;
  salary_information: AddSalaryInformationRequest;
  travel_expenses?: Allowance[];
}

interface AddPersonalInformationRequest {
  address?: string;
  personal_email?: string;
  personal_phone_number?: string;
  birthdate: string;
  gender: number;
  marital_status: number;
}

interface AddWorkingInformationRequest {
  area_id: string;
  branch_id: number;
  job_position_id: string;
  cost_center_id: string;
  entry_date: string;

  daem?: string;
  work_email?: string;
  inss_number?: string;
  bank_account_number?: string;
  work_phone_number?: string;
}

interface AddSalaryInformationRequest {
  currency: number;
  salary: number;
  salary_type: number;
  sub_catalog_bank_id: number;
}
