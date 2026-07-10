interface CreateDeductionBase {

   payroll_id: string;

   branch_id: string;

   company_id: string;

   module_code: string;

   deduction_type: number;
}

export interface CreateLateArrivalsDeductionRequest extends CreateDeductionBase {
   late_arrivals_information: LateArrivalsInformation;
}

export interface CreatePurisimaDeductionRequest extends CreateDeductionBase {
   purisima_information: PurisimaInformation;
}

export interface CreateLoanDeductionRequest extends CreateDeductionBase {
   loans_payload: LoansPayload;
}

export interface CreateJudicialSeizureDeductionRequest extends CreateDeductionBase {
   judicial_seizure_payload: JudicialSeizurePayload;
}

export interface CreateSanctionDeductionRequest extends CreateDeductionBase {
   sansion_payload: SanctionPayload;
}

/**

 * @description Payload enviado al API según el tipo de deducción.

 */

export type CreateDeductionRequest =
   | CreateLateArrivalsDeductionRequest
   | CreatePurisimaDeductionRequest
   | CreateLoanDeductionRequest
   | CreateJudicialSeizureDeductionRequest
   | CreateSanctionDeductionRequest;

/**

 * @description Valores del formulario (campos opcionales según el tipo seleccionado).

 */

export type AddDeductionFormValues = {

   payroll_id: string;

   branch_id: string;

   company_id: string;

   module_code: string;

   deduction_type: number | "";

   collaborator_id?: string;

   description?: string;

   late_arrivals_information?: LateArrivalsInformation;

   purisima_information?: PurisimaInformation;

   loans_payload?: LoansPayload;

   judicial_seizure_payload?: JudicialSeizurePayload;

   sansion_payload?: SanctionPayload;
};

export interface LateArrivalsInformation {

   procedure_method: number,

   late_arrivals_payload?: LateArrivalsPayload,

   late_arrivals_data?: LateArrivalsPayload[];
}

export interface LateArrivalsPayload {

   identification_number: string;

   total_minutes: number;
}

export interface PurisimaInformation {

   procedure_method: number;

   purisima_payload?: PurisimaPayload;

   purisima_data?: PurisimaPayload[];
}

export interface PurisimaPayload {

   amount: number;

   identification_number: string;

   number_fortnights: number;
}

export interface LoansPayload {

   amount: number;

   number_fortnights: number;

   currency: number;

   identification_number: string;

   description: string;
}

export interface JudicialSeizurePayload {

   currency: number;

   total_amount_to_pay: number;

   deduction_percentage: number;

   description: string;

   identification_number: string;
}

export interface SanctionPayload {

   amount_days: number;

   identification_number: string;
}