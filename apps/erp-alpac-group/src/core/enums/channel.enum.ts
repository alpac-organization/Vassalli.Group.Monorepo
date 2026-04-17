import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum ChannelEnum
 * @description IDs de los canales de comunicación disponibles en el sistema.
 */
export const ChannelEnum = {
   PersonalPanel: { value: 1, label: "Personal" }, // permission-page.tsx
   DirectManagerPanel: { value: 2, label: "Jefe Directo" }, // applications-page.tsx
   AdministrativePanel: { value: 3, label: "Administrativo" }, // collaborator-page.tsx && applications-page.tsx
} as const;

export type ChannelEnum = (typeof ChannelEnum)[keyof typeof ChannelEnum];

export const ChannelOptions: EnumType[] = Object.values(
   ChannelEnum,
).sort((a, b) => a.label.localeCompare(b.label));
