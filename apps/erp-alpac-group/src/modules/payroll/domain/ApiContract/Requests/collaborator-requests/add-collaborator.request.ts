import type { Allowance } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-income-form/add-allowance-form.types";

export interface AddCollaboratorRequest {
   company_id: string;
   module_code: string;
   first_name: string;
   second_name?: string;
   third_name?: string;
   first_lastname: string;
   second_lastname?: string;
   identification_number: string;
   identification_type: number;
   gender: number;
   personal_information: AddPersonalInformationRequest;
   working_information: AddWorkingInformationRequest;
   salary_information: AddSalaryInformationRequest;
   travel_expenses?: Allowance[];
}

interface AddPersonalInformationRequest {
   address?: string;
   personal_email?: string;
   personal_phone_number: string;
   departament: string;
   birthdate: string;
   marital_status: number;
}

interface AddWorkingInformationRequest {
   work_area_id: number;
   work_position_id: number;
   branch_id: number;
   bank_account_number?: string;
   work_email?: string;
   work_phon_number: string;
   inss_number?: string;
   entry_date: string;
}

interface AddSalaryInformationRequest {
   currency: number;
   salary: number;
   salary_type: number;
   sub_catalog_bank_id: number;
}