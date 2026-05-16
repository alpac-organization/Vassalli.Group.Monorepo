type ApprovalStepStatus = "approved" | "rejected" | "pending";

export function mapApprovalToStepStatus(
  value: boolean | null,
): ApprovalStepStatus {
  if (value === true) return "approved";
  if (value === false) return "rejected";
  return "pending";
}
