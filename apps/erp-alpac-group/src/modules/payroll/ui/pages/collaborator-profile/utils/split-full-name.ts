/**
 * Parte el nombre completo en campos de formulario (heurística para nombres comunes de 2–4+ partes).
 */
export function splitFullNameForForm(fullName: string): {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", firstLastName: "" };
  if (parts.length === 1) return { firstName: parts[0], firstLastName: "" };
  if (parts.length === 2) {
    return { firstName: parts[0], firstLastName: parts[1] };
  }
  if (parts.length === 3) {
    return {
      firstName: parts[0],
      firstLastName: parts[1],
      secondLastName: parts[2],
    };
  }
  return {
    firstName: parts[0] ?? "",
    secondName: parts[1],
    firstLastName: parts[parts.length - 2] ?? "",
    secondLastName: parts[parts.length - 1] ?? "",
  };
}
