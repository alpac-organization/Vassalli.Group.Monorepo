// packages/shared/src/constants/spacing.ts
export const spacings = {
  none:  '0',
  xs:    '8px',   
  sm:    '10px',  
  md:    '12px',  
  lg:    '14px',  
  xl:    '16px',  
  '2xl': '18px',
  '3xl': '20px',
  '4xl': '22px', 
  '5xl': '24px',
  huge:  '32px' 
} as const;

export type SpacingSize = keyof typeof spacings;
export const spacingsRecord: Record<SpacingSize, string> = spacings;