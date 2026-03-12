export const companyTokens = {
   ALPAC: {
      primary: {
         base50:  '#E6EDF5',
         base100: '#CDDCEB',
         base500: '#004f9e',
         base700: '#003A75',
         base900: '#00254B',
      },
      secondary: {
         base50:  '#FCE6E7',
         base500: '#e20612',
         base700: '#B3050E',
      }
   },
   AMINSA: {
      primary: {
         base50:  '#E6F0EB',
         base100: '#CDE1D7',
         base500: '#006837',
         base700: '#004D29',
         base900: '#00331B',
      },
      secondary: {
         base50:  '#F3F9EC',
         base500: '#8CC63F',
         base700: '#6FA12F',
      }
   },
   AVASA: {
      primary: {
         base50:  '#E6F3EC',
         base500: '#008542',
         base700: '#006633',
      },
      secondary: {
         base50:  '#E6F6EE',
         base500: '#00A651',
         base700: '#00803E',
      }
   },
   VIGEMSA: {
      primary: {
         base50:  '#E8EAEE',
         base500: '#1B2C56',
         base700: '#142141',
      },
      secondary: {
         base50:  '#F7F3EC',
         base500: '#B38D45',
         base700: '#8A6D35',
      },
      accent: {
         base50:  '#FCE8E9',
         base500: '#E31E24',
         base700: '#B3181D',
      }
   },
   TMN: {
      primary: {
         base50:  '#E6F6EE',
         base500: '#00A651',
         base700: '#00803E',
      },
      secondary: {
         base50:  '#FDE8E9',
         base500: '#ED1C24',
         base700: '#BA161C',
      },
      accent: {
         base50:  '#E8E8E8',
         base500: '#000000',
         base700: '#1A1A1A',
      }
   }
} as const;

export const neutralTokens = {
   white:   '#FFFFFF',
   base50:  '#F9FAFB',
   base100: '#F3F4F6',
   base200: '#E5E7EB',
   base300: '#D1D5DB',
   base400: '#9CA3AF',
   base500: '#6B7280',
   base600: '#4B5563',
   base700: '#374151',
   base800: '#1F2937',
   base900: '#111827',
   base950: '#030712',
   black:   '#000000',
} as const;


export const feedbackTokens = {
   error:   '#D32F2F',
   success: '#2E7D32',
   warning: '#ED6C02',
   info:    '#0288D1',
} as const;