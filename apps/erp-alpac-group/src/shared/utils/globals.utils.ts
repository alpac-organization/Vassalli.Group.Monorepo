export const toOptionalNumber = (value: unknown) =>
   value === "" || value === null || value === undefined
      ? undefined
      : Number(value);