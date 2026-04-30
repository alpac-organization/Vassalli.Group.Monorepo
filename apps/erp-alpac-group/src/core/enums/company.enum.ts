export const CompanyEnum = {
   ALPAC: 'ALPAC',
   AMINSA: 'AMINSA',
   AVASA: 'AVASA',
   VIGEMSA: 'VIGEMSA',
   TMN: 'TMN',
} as const;

export type CompanyType = (typeof CompanyEnum)[keyof typeof CompanyEnum];