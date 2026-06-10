import type { GetBranchesResponse } from "@app/modules/auth/domain/ApiContract/Responses/get-branches.response";
export type SalaryType = "Fixed" | "Variable" | "ProfessionalServices";
import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export function mapSalaryTypeToPayrollType(
  salaryType: SalaryType,
): PayrollType {
  switch (salaryType) {
    case "Fixed":
      return "Ordinary";
    case "Variable":
      return "Provided";
    case "ProfessionalServices":
      return "ProfessionalServices";
    default:
      return "None";
  }
}
export function mapBranchNametoBranchId(
  branchName: string,
  branches: GetBranchesResponse[],
) {
  if (!branchName) return null;
  const branch = branches.find((branch) => branch.branch_name === branchName);
  return branch?.branch_id;
}
