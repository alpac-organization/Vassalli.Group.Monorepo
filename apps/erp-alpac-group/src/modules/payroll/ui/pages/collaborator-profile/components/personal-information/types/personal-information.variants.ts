import { GenderEnum } from "@app/core/enums/gender.enum";
import { MaritalStatus } from "@app/core/enums/marital-status.enum";

export const GenderApiAliases: Record<string, keyof typeof GenderEnum> = {
  Man: "Male",
  Woman: "Female",
};

/** Texto del API (inglés u otros) → clave del objeto `MaritalStatus` en core. */
export const MaritalApiAliases: Record<string, keyof typeof MaritalStatus> = {
  None: "None",
  Single: "Single",
  Married: "Married",
  Divorced: "Divorced",
  Widowed: "Widowed",
  Domestic_Partner: "Domestic_Partner",
  Separated: "Separated",
  Other: "Other",
  "Free union": "Domestic_Partner",
  "Union libre": "Domestic_Partner",
};
