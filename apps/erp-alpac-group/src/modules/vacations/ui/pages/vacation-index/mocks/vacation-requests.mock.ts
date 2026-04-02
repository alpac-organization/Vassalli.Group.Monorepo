import type { VacationRequestRow } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-request.types";

export const MOCK_VACATION_REQUESTS: VacationRequestRow[] = [
  {
    id: "1",
    full_name: "Carlos García",
    start_date: "2024-04-15",
    end_date: "2024-04-22",
    status: "Approved",
    approved_by: "María López",
  },
  {
    id: "2",
    full_name: "Ana Martínez",
    start_date: "2024-05-01",
    end_date: "2024-05-03",
    status: "Pending",
    approved_by: null,
  },
  {
    id: "3",
    full_name: "Luis Fernández",
    start_date: "2024-03-10",
    end_date: "2024-03-12",
    status: "Rejected",
    approved_by: "Pedro Sánchez",
  },
  {
    id: "4",
    full_name: "Elena Ruiz",
    start_date: "2024-06-20",
    end_date: "2024-06-28",
    status: "Approved",
    approved_by: "María López",
  },
  {
    id: "4",
    full_name: "estela Ruiz",
    start_date: "2024-06-20",
    end_date: "2024-06-28",
    status: "Cancelled",
    approved_by: "guzman López",
  },
];
