export type VacationRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type VacationRequestRow = {
  id: string;
  full_name: string;
  start_date: string;
  end_date: string;
  status: VacationRequestStatus;
  approved_by: string | null;
};

/** Valor del filtro de estado en UI: "all" = todos */
export type VacationStatusFilterValue = "all" | VacationRequestStatus;
