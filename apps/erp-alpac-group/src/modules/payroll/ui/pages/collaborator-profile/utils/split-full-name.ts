/**
 *  * Parte el nombre completo en el formulario de perfil de colaborador.
 */
export type SplitFullNameForFormResult = {
  first_name: string;
  second_name: string;
  third_name: string;
  first_surname: string;
  second_surname: string;
};

const emptyDefaultValues: SplitFullNameForFormResult = {
  first_name: "",
  second_name: "",
  third_name: "",
  first_surname: "",
  second_surname: "",
};

export function splitFullNameForForm(
  fullName: string,
): SplitFullNameForFormResult {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const n = parts.length;

  if (n === 0) return { ...emptyDefaultValues };
  if (n === 1) {
    return { ...emptyDefaultValues, first_name: parts[0] ?? "" };
  }
  if (n === 2) {
    return {
      ...emptyDefaultValues,
      first_name: parts[0] ?? "",
      first_surname: parts[1] ?? "",
    };
  }
  if (n === 3) {
    return {
      ...emptyDefaultValues,
      first_name: parts[0] ?? "",
      first_surname: parts[1] ?? "",
      second_surname: parts[2] ?? "",
    };
  }
  if (n === 4) {
    return {
      ...emptyDefaultValues,
      first_name: parts[0] ?? "",
      second_name: parts[1] ?? "",
      first_surname: parts[2] ?? "",
      second_surname: parts[3] ?? "",
    };
  }
  if (n === 5) {
    return {
      first_name: parts[0] ?? "",
      second_name: parts[1] ?? "",
      third_name: parts[2] ?? "",
      first_surname: parts[3] ?? "",
      second_surname: parts[4] ?? "",
    };
  }
  return {
    first_name: parts[0] ?? "",
    second_name: parts[1] ?? "",
    third_name: parts[2] ?? "",
    first_surname: parts[n - 2] ?? "",
    second_surname: parts[n - 1] ?? "",
  };
}
