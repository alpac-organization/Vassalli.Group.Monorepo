/**
 * @enum ChannelEnum
 * @description IDs de los canales de comunicación disponibles en el sistema.
 */
export const ChannelEnum = {
  PersonalPanel: { value: 1, label: "Personal" },
  // DirectManagerPanel: { value: 2, label: "Jefe Directo" },
  AdministrativePanel: { value: 2, label: "Administrativo" },
} as const;

export type ChannelEnum = (typeof ChannelEnum)[keyof typeof ChannelEnum];
