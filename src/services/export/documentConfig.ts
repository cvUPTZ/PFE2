import { convertInchesToTwip } from 'docx';

// Create a comprehensive, type-safe configuration object
export const DOCUMENT_CONSTANTS = {
  PAGE: {
    MARGINS: {
      top: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1.5), // Wider left margin for binding
    },
    SIZE: {
      width: convertInchesToTwip(8.5),
      height: convertInchesToTwip(11),
    },
    STANDARD_SIZES: {
      A4: {
        width: convertInchesToTwip(8.27),
        height: convertInchesToTwip(11.69)
      },
      LETTER: {
        width: convertInchesToTwip(8.5),
        height: convertInchesToTwip(11)
      }
    }
  },
  SECTION: {
    TYPES: {
      NEXT_PAGE: 'nextPage',
      CONTINUOUS: 'continuous'
    } as const
  },
  NUMBER_FORMAT: {
    DECIMAL: 'decimal',
    LOWER_ROMAN: 'lowerRoman',
    UPPER_ROMAN: 'upperRoman',
    ALPHABETIC: 'alphabetic'
  } as const
} as const;

// Utility function for custom margin calculations
export function createCustomMargins(
  options: Partial<typeof DOCUMENT_CONSTANTS.PAGE.MARGINS>
) {
  return {
    ...DOCUMENT_CONSTANTS.PAGE.MARGINS,
    ...options
  };
}