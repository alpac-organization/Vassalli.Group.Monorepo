export interface BranchDisplaySource {
  branch_code?: string | null;
  company_alias?: string | null;
  branch_name?: string | null;
}

export interface FormattedBranchDisplay {
  primary: string;
  secondary?: string;
}

export function formatBranchDisplay(
  branch?: BranchDisplaySource | null,
  fallback = "—",
): FormattedBranchDisplay {
  const codeAndAlias = [branch?.branch_code?.trim(), branch?.company_alias?.trim()]
    .filter(Boolean)
    .join(" · ");
  const branchName = branch?.branch_name?.trim() || "";

  if (codeAndAlias) {
    return {
      primary: codeAndAlias,
      secondary: branchName || undefined,
    };
  }

  if (branchName) {
    return {
      primary: branchName,
    };
  }

  return {
    primary: fallback,
  };
}
