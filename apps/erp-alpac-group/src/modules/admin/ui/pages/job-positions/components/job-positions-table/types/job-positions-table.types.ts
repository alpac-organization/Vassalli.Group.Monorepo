import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";
import type { JobPositionColumnDef } from "@app/modules/admin/ui/pages/job-positions/components/job-positions-table/utils/job-positions-columns";
import type { ReactNode } from "react";

export interface JobPositionsTableProps {
  data: GetJobPositionsResponse[];
  onDeleteClick: (jobPosition: GetJobPositionsResponse) => void;
  deleteIcon?: ReactNode;
  columns: JobPositionColumnDef[];
  pagination?: ReactNode;
  isLoading?: boolean;
}
