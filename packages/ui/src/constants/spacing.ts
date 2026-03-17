// packages/shared/src/constants/spacing.ts
export const spacings = {
  none:  '0',
  xs:    '8px',   
  sm:    '8.5px',  
  md:    '10px',  
  lg:    '12px',  
  xl:    '14px',  
  '2xl': '16px',
  '3xl': '18px',
  '4xl': '20px', 
  '5xl': '22px',
  huge:  '30px' 
} as const;

export type SpacingSize = keyof typeof spacings;
export const spacingsRecord: Record<SpacingSize, string> = spacings;