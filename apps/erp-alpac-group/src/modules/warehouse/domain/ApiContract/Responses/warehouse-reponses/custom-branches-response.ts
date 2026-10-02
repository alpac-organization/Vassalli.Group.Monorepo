export interface CustomBranch {
  custom_branch_id: string;
  code?: string;
  customs_branch_name: string;
  id?: string;
  name?: string;
}

export interface GetCustomBranchesResponse {
  data: CustomBranch[];
  page_number?: number;
  page_size?: number;
  total?: number;
}

export function extractCustomBranches(
  response?: GetCustomBranchesResponse | CustomBranch[] | null,
): CustomBranch[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  return [];
}