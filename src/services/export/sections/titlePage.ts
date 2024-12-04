import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { ThesisMetadata } from '../../../types';

export function createTitlePage(metadata: ThesisMetadata): Paragraph[] {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.title || '',
          size: 32,
          bold: true,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2), after: convertInchesToTwip(1.5) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'by',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1), after: convertInchesToTwip(0.5) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.author || '',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: convertInchesToTwip(2) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'A thesis submitted in partial fulfillment',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'of the requirements for the degree of',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: convertInchesToTwip(0.5) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.field || '',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: convertInchesToTwip(2) },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.university || '',
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: currentDate,
          size: 24,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(2) },
    }),
  ];
}