import type { EnumType } from "@app/shared/types/enum.type";

export const CompanyEnum = {
   ALPAC: 'ALPAC',
   AMINSA: 'AMINSA',
   AVASA: 'AVASA',
   VIGEMSA: 'VIGEMSA',
   TMN: 'TMN',
} as const satisfies Record<string, string>;

export type CompanyType = (typeof CompanyEnum)[keyof typeof CompanyEnum];

type CompanyMetadataType = EnumType & {
   value: CompanyType;
   acronym: 'ALP' | 'AMS' | 'AVS' | 'VGM' | 'TMN';
}

export const CompanyMatadata = {
   ALPAC: { label: "Almacenadora del Pacífico", value: "ALPAC", acronym: "ALP" },
   AMINSA: { label: "Agencia Marítima Internacional", value: "AMINSA", acronym: "AMS" },
   AVASA: { label: "Agencia Vassalli S.A.", value: "AVASA", acronym: "AVS" },
   VIGEMSA: { label: "Vigilancia Empresarial", value: "VIGEMSA", acronym: "VGM" },
   TMN: { label: "Transporte Multimodales de Nicaragua", value: "TMN", acronym: "TMN" },
} as const satisfies Record<CompanyType, CompanyMetadataType>;