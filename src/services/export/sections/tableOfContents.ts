import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { Chapter } from '../../../types';

export function createTableOfContents(chapters: Chapter[]): Paragraph[] {
  const tocEntries: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: 'Table of Contents',
          size: 28,
          bold: true,
          font: 'Times New Roman'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: convertInchesToTwip(0.5) },
    }),
  ];

  // Add front matter entries
  tocEntries.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Abstract',
          size: 24,
          font: 'Times New Roman'
        }),
        new TextRun({
          text: '\t',
          font: 'Times New Roman'
        }),
        new TextRun({
          text: 'ii',
          size: 24,
          font: 'Times New Roman'
        }),
      ],
      spacing: { before: 120, after: 120 },
    })
  );

  // Add chapter entries
  chapters.forEach((chapter, index) => {
    tocEntries.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Chapter ${index + 1}. ${chapter.title}`,
            size: 24,
            font: 'Times New Roman'
          }),
          new TextRun({
            text: '\t',
            font: 'Times New Roman'
          }),
          new TextRun({
            text: `${index + 1}`,
            size: 24,
            font: 'Times New Roman'
          }),
        ],
        spacing: { before: 120, after: 120 },
      })
    );

    // Add section entries
    chapter.sections.forEach((section, sectionIndex) => {
      tocEntries.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${section.title}`,
              size: 24,
              font: 'Times New Roman'
            }),
            new TextRun({
              text: '\t',
              font: 'Times New Roman'
            }),
            new TextRun({
              text: `${index + 1}.${sectionIndex + 1}`,
              size: 24,
              font: 'Times New Roman'
            }),
          ],
          indent: { left: convertInchesToTwip(0.5) },
          spacing: { before: 120, after: 120 },
        })
      );
    });
  });

  return tocEntries;
}