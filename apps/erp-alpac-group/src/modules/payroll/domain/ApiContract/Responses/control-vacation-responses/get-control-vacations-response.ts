export interface CollaboratorVacationInfo {
  code: string;
  collaborator_id: string;
  collaborator_fullname: string;
  identification_number: string;
  entry_date: string;
}

export interface VacationAccruals {
  vacation_id: string;
  vacation_balance: number;
  enjoyed_vacations: number;
  collaborator_information: CollaboratorVacationInfo;
}

export interface GetVacationsListResponse {
  data: VacationAccruals[];
  total: number;
  page_size: number;
  page_number: number;
}
