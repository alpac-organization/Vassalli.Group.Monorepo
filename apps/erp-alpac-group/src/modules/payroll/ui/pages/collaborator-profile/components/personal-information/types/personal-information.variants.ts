import { GenderEnum } from "@app/core/enums/gender.enum";
import { MaritalStatusEnum } from "@app/core/enums/marital-status.enum";

export const GenderApiAliases: Record<string, keyof typeof GenderEnum> = {
  Man: "MALE",
  Woman: "FEMALE",
};

export const MaritalApiAliases: Record<string, keyof typeof MaritalStatusEnum> =
  {
    Single: "SINGLE",
    Married: "MARRIED",
    Divorced: "DIVORCED",
    Widowed: "WIDOWED",
    "Free union": "FREE_UNION",
    "Union libre": "FREE_UNION",
  };
