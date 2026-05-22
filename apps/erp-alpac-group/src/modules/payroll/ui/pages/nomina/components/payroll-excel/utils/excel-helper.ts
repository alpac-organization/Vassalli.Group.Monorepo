export function colWidth(key: string): number {
  if (key === "full_name" || key === "branch_name") return 35;
  if (key === "inss_number") return 18;
  return 14;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}
