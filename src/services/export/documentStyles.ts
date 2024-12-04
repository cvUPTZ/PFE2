import { 
  StylesOptions, 
  AlignmentType, 
  TabStopType, 
  TabStopPosition 
} from 'docx';

// Create type aliases for better readability
type FontSize = number;
type SpacingValue = number;

// Define constant for font configurations
const FONT_CONFIGS = {
  PRIMARY: 'Times New Roman',
  DEFAULT_COLOR: '000000'
} as const;

// Define constant for text sizes in points
const TEXT_SIZES = {
  BODY: 12,
  TITLE: 16,
  HEADING1: 14,
  HEADING2: 13,
  TOC: 14
} as const;

export const DOCUMENT_STYLES: StylesOptions = {
  default: {
    document: {
      run: {
        font: FONT_CONFIGS.PRIMARY,
        size: convertInchesToTwip(TEXT_SIZES.BODY / 2), // Convert pt to half-pt
        color: FONT_CONFIGS.DEFAULT_COLOR,
      },
      paragraph: {
        spacing: {
          line: 480, // Double spacing
          after: 240,
        },
      },
    },
  },
  paragraphStyles: [
    {
      id: 'Title',
      name: 'Title',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        size: convertInchesToTwip(TEXT_SIZES.TITLE / 2),
        bold: true,
      },
      paragraph: {
        alignment: AlignmentType.CENTER,
        spacing: { 
          before: 480, 
          after: 480 
        },
      },
    },
    {
      id: 'Heading1',
      name: 'Heading 1',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        size: convertInchesToTwip(TEXT_SIZES.HEADING1 / 2),
        bold: true,
      },
      paragraph: {
        spacing: { 
          before: 480, 
          after: 240 
        },
      },
    },
    {
      id: 'Heading2',
      name: 'Heading 2',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        size: convertInchesToTwip(TEXT_SIZES.HEADING2 / 2),
        bold: true,
      },
      paragraph: {
        spacing: { 
          before: 360, 
          after: 240 
        },
      },
    },
    {
      id: 'TOC',
      name: 'Table of Contents',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        size: convertInchesToTwip(TEXT_SIZES.TOC / 2),
        bold: true,
      },
      paragraph: {
        spacing: { 
          before: 240, 
          after: 240 
        },
        alignment: AlignmentType.CENTER,
      },
    },
    {
      id: 'TOCEntry',
      name: 'TOC Entry',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      paragraph: {
        spacing: { 
          before: 120, 
          after: 120 
        },
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
            leader: TabStopType.DOT,
          },
        ],
      },
    },
  ],
};

// Utility function to convert points to half-points (docx requirement)
function convertInchesToTwip(points: number): number {
  // 1 point = 2 half-points
  return points * 2;
}