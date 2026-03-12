// packages/shared/src/constants/radii.ts
export const radius = {
  none: '0',
  xs: '10px',   // Muy sutil (ej: checkboxes)
  sm: '14px',   // Estándar (ej: botones pequeños)
  md: '18px',   // Suave (ej: botones medianos/inputs)
  lg: '22px',   // Moderno (ej: cards/botones grandes)
  xl: '24px',  // Muy redondeado (ej: modales)
  full: '9999px',
} as const;