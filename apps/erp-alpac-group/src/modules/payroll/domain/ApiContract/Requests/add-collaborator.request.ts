export interface AddCollaboratorRequest {
  first_name?: string;
  second_name?: string;
  third_name?: string;
  first_lastname?: string;
  second_lastname?: string;
  identification_number?: string;
  identification_type?: number;
  gender?: number;
  personal_information?: AddPersonalInformationRequest;
  working_information?: AddWorkingInformationRequest;
  salary_information?: AddSalaryInformationRequest;
}

export interface AddPersonalInformationRequest {
  address?: string;
  personal_email?: string;
  personal_phone_number?: string;
  departament?: string;
  birthdate?: string;
}

export interface AddWorkingInformationRequest {
  work_area_id?: number;
  work_position_id?: number;
  branch_id?: number;
  bank_account_number?: string;
  work_email?: string;
  work_phon_number?: string;
  inss_number?: string;
  entry_date?: string;
}

export interface AddSalaryInformationRequest {
  currency?: number;
  salary?: number;
  salary_type?: number;
  sub_catalog_bank_id?: number;
}
