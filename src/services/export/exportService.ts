import { 
  Document, 
  Packer, 
  Header, 
  Footer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType 
} from 'docx';
import { saveAs } from 'file-saver';

// Centralize type imports
import type { ThesisMetadata, Chapter } from '../../types';

// Use constants from separate configuration files
import { DOCUMENT_STYLES } from './documentStyles';
import { DOCUMENT_CONSTANTS } from './documentConfig';

// Import section creators with explicit typing
import { createTitlePage } from './sections/titlePage';
import { createTableOfContents } from './sections/tableOfContents';
import { createAbstractPage } from './sections/abstractPage';

// Define configuration interface for better type management
interface DocumentSectionConfig {
  type: string;
  pageSize: { width: number; height: number };
  margins: { 
    top: number; 
    right: number; 
    bottom: number; 
    left: number; 
  };
}

export class ExportService {
  // Enhanced static method with more robust error handling
  static async exportToWord(
    metadata: ThesisMetadata, 
    chapters: Chapter[]
  ): Promise<void> {
    try {
      // Extract repeated configuration to reduce duplication
      const sectionConfig: DocumentSectionConfig = {
        type: DOCUMENT_CONSTANTS.SECTION.TYPES.NEXT_PAGE,
        pageSize: DOCUMENT_CONSTANTS.PAGE.SIZE,
        margins: DOCUMENT_CONSTANTS.PAGE.MARGINS
      };

      const doc = new Document({
        styles: DOCUMENT_STYLES,
        sections: [
          this.createFirstSection(metadata, chapters),
          this.createChaptersSection(metadata, chapters)
        ],
      });

      const blob = await Packer.toBlob(doc);
      const fileName = this.generateFileName(metadata);
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Document Export Error:', error);
      throw new Error('Failed to export document');
    }
  }

  // Extracted method for first section creation
  private static createFirstSection(
    metadata: ThesisMetadata, 
    chapters: Chapter[]
  ) {
    return {
      properties: {
        type: DOCUMENT_CONSTANTS.SECTION.TYPES.NEXT_PAGE,
        page: {
          size: DOCUMENT_CONSTANTS.PAGE.SIZE,
          margin: DOCUMENT_CONSTANTS.PAGE.MARGINS,
        },
      },
      headers: this.createDefaultHeader(),
      footers: this.createDefaultFooter(metadata),
      children: [
        ...createTitlePage(metadata),
        ...createTableOfContents(chapters),
        ...createAbstractPage(metadata),
      ],
    };
  }

  // Extracted method for chapters section creation
  private static createChaptersSection(
    metadata: ThesisMetadata, 
    chapters: Chapter[]
  ) {
    return {
      properties: {
        type: DOCUMENT_CONSTANTS.SECTION.TYPES.NEXT_PAGE,
        page: {
          size: DOCUMENT_CONSTANTS.PAGE.SIZE,
          margin: DOCUMENT_CONSTANTS.PAGE.MARGINS,
        },
      },
      headers: this.createDefaultHeader(),
      footers: this.createChapterFooter(metadata),
      children: chapters.flatMap((chapter, index) => [
        this.createChapterTitle(chapter, index),
        ...this.createChapterSections(chapter)
      ]),
    };
  }

  // Helper methods for creating specific document elements
  private static createDefaultHeader() {
    return {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ 
              text: '[Page]', 
              font: 'Times New Roman' 
            })
          ],
        })],
      }),
    };
  }

  private static createDefaultFooter(metadata: ThesisMetadata) {
    return {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ 
              text: metadata.university || '', 
              font: 'Times New Roman' 
            })
          ],
        })],
      }),
    };
  }

  private static createChapterFooter(metadata: ThesisMetadata) {
    return {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ 
                text: `${metadata.author || ''} - ${metadata.title || ''}`,
                font: 'Times New Roman'
              })
            ],
          }),
        ],
      }),
    };
  }

  private static createChapterTitle(chapter: Chapter, index: number) {
    return new Paragraph({
      children: [
        new TextRun({
          text: `Chapter ${index + 1}. ${chapter.title}`,
          size: 28,
          bold: true,
          font: 'Times New Roman'
        })
      ],
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
    });
  }

  private static createChapterSections(chapter: Chapter) {
    return chapter.sections.flatMap(section => [
      new Paragraph({
        children: [
          new TextRun({
            text: section.title,
            size: 26,
            bold: true,
            font: 'Times New Roman'
          })
        ],
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: section.content || '',
            size: 24,
            font: 'Times New Roman'
          })
        ],
        alignment: AlignmentType.JUSTIFIED,
      }),
    ]);
  }

  // Improved filename generation with more robust sanitization
  private static generateFileName(metadata: ThesisMetadata): string {
    const baseFileName = metadata.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'thesis';
    
    return `${baseFileName}.docx`;
  }
}