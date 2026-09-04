export type AssignmentFilters = {
  driver_name: string;
  license_plate: string;
  document_type: string;
  service_order_code: string;
};

export type SelectedAssignmentTarget = {
  reception_id: string;
  entrance_ducat_id: string | null; 
  license_plate: string;
  driver_name: string;
  ducat_number: string | null;
  document_type?: string;
  service_order_code?: string | null;
};

export type AssignmentPageView = "pending" | "history";

export const EMPTY_FILTERS: AssignmentFilters = {
  driver_name: "",
  license_plate: "",
  document_type: "",
  service_order_code: "",
};
