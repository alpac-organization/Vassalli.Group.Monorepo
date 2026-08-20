import type { EnumType } from "@app/shared/types/enum.type";
import type { SectionEnumType } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

export const SectionStorageTypeEnum = {
  Empty: { value: 1, label: "Vacío", textValue: "Empty" },
  Racks: { value: 2, label: "Racks", textValue: "Racks" },
  Lots: { value: 3, label: "Tramos", textValue: "Lots" },
} as const satisfies Record<string, SectionEnumType>;

export type SectionStorageTypeEnum =
  (typeof SectionStorageTypeEnum)[keyof typeof SectionStorageTypeEnum];

export const SectionStorageTypeOptions: EnumType[] = Object.values(
  SectionStorageTypeEnum,
);

export type SectionStorageTypeValue =
  (typeof SectionStorageTypeEnum)[keyof typeof SectionStorageTypeEnum]["textValue"];

//   type SectionTypeProps = {
//    path:string;
//    params: {company:string,module_code:Object}
//   }
//   type ErrorProneSection = {
//    error:{status:number,message:string};
//   }
//   type ResolveSection = {
//    data:string[];
//   }
//   function GetSection(value:{isValid:boolean, capacity:number, type:SectionTypeProps }){
//    if(!value.isValid){
//       return
//    }
//   }
