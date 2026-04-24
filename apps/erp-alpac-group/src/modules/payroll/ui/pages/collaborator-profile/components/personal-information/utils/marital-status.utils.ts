import { MaritalStatus } from "@app/core/enums/marital-status.enum";
export type MaritalStatusSource = string | number | null;
const MARITAL_VALUES = Object.values(MaritalStatus);
const MARITAL_STATUS_MIN = Math.min(
   ...MARITAL_VALUES.map((m) => m.value),
);
const MARITAL_STATUS_MAX = Math.max(
   ...MARITAL_VALUES.map((m) => m.value),
);

/**
 * aqui la funcion Busca y devuelve el objeto completo del Enum ({ value, label }) MaritalStatus.
 */
function getMaritalStatusObj(raw: MaritalStatusSource) {
   if (raw === null || raw === "") return null;
   const s = String(raw).trim();
   const n = Number(s);

   if (
      Number.isInteger(n) &&
      n >= MARITAL_STATUS_MIN &&
      n <= MARITAL_STATUS_MAX
   ) {
      return MARITAL_VALUES.find((m) => m.value === n);
   }

   const normInput = s.toLowerCase();
   const normInputCompact = normInput.replace(/_/g, "");
   for (const [key, obj] of Object.entries(MaritalStatus)) {
      const normKey = key.toLowerCase();
      const normKeyCompact = normKey.replace(/_/g, "");
      if (
         normInput === normKey ||
         normInputCompact === normKeyCompact ||
         obj.label.toLowerCase() === s.toLowerCase()
      )
         return obj;
   }
   return null;
}
/*
 * Para la (UI):
 * Recibe el string de la API ("Single") y devuelve el texto legible ("Soltero") segun MaritalStatusEnum.
 */
export function maritalRawToLabel(raw: MaritalStatusSource): string | null {
   const match = getMaritalStatusObj(raw);
   return match?.label ?? null;
}

/**
 * PARA enviar al backend el value del MaritalStatus correspondiente
 * al que se va actualizar usando MaritalStatusEnum:
 * devuelve estrictamente el NÚMERO (value) que necesita la API.
 */
export function normalizeMaritalStatusFromApi(
   raw: MaritalStatusSource,
): number | null {
   const match = getMaritalStatusObj(raw);
   return match ? match.value : null;
}

export function isValidMaritalStatusCode(n: number): boolean {
   return (
      Number.isInteger(n) && n >= MARITAL_STATUS_MIN && n <= MARITAL_STATUS_MAX
   );
}
