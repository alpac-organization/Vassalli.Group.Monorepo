export const fontSizes = {
    xs: '12px',    // 0.75rem
    sm: '14px',    // 0.875rem
    md: '16px',    // 1rem (Base)
    lg: '18px',    // 1.125rem
    xl: '20px',    // 1.25rem
    '2xl': '24px', // 1.5rem
    '3xl': '30px', // 1.875rem
    '4xl': '36px', // 2.25rem
} as const;

export type FontSize = keyof typeof fontSizes;
