import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { ThesisMetadata } from '../../../types';

export function createAbstractPage(metadata: ThesisMetadata): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Abstract',
          size: 28,
          bold: true,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.abstract || 'No abstract provided.',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(1) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Keywords: ${metadata.keywords?.join(', ') || 'None provided'}`,
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { before: convertInchesToTwip(1) },
    }),
  ];
}