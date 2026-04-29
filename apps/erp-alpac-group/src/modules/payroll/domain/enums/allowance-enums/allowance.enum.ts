export const AllowanceCodeEnum = {
   ALW_MEAL: "ALW_MEAL",
   ALW_HOUSING: "ALW_HOUSING",
   ALW_TRANSPORT: "ALW_TRANSPORT",
} as const;

export type AllowanceCodeEnum = (typeof AllowanceCodeEnum)[keyof typeof AllowanceCodeEnum];