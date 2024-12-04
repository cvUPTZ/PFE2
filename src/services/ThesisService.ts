import { MetadataService } from './metadata/metadataService';
import { ChapterService } from './chapters/chapterService';
import { ReferenceService } from './references/referenceService';
import { SectionService } from './chapters/sectionService';

export class ThesisService {
  // Metadata Methods
  static getUserThesis = MetadataService.getUserThesis;
  static upsertThesisMetadata = MetadataService.upsertThesisMetadata;
  
  // Chapter Methods
  static getChapters = ChapterService.getChapters;
  static addChapter = ChapterService.addChapter;
  static editChapter = ChapterService.editChapter;
  static deleteChapter = ChapterService.deleteChapter;
  static reorderChapters = ChapterService.reorderChapters;
  
  // Reference Methods
  static getReferences = ReferenceService.getReferences;
  static addReference = ReferenceService.addReference;
  static searchReferences = ReferenceService.searchReferences;
  static generateBibliography = ReferenceService.generateBibliography;
  static setCitationStyle = ReferenceService.setCitationStyle;
  
  // Section Methods
  static getSections = SectionService.getSections;
  static addSection = SectionService.addSection;
  static editSection = SectionService.editSection;
  static deleteSection = SectionService.deleteSection;
  static mergeSections = SectionService.mergeSections;

  // Composite Methods
  static async calculateThesisProgress(): Promise<{
    chaptersCount: number;
    sectionsCount: number;
    referencesCount: number;
    progressPercentage: number
  }> {
    const chapters = await this.getChapters();
    const references = await this.getReferences();

    const chaptersCount = chapters.length;
    const sectionsCount = chapters.reduce((total, chapter) => total + chapter.sections.length, 0);
    const referencesCount = references.length;

    // Basic progress calculation
    const baseProgressSteps = [
      !!(await this.getUserThesis()),
      chaptersCount > 0,
      sectionsCount > 0,
      referencesCount > 0
    ];

    const progressPercentage = (baseProgressSteps.filter(Boolean).length / baseProgressSteps.length) * 100;

    return {
      chaptersCount,
      sectionsCount,
      referencesCount,
      progressPercentage
    };
  }


  static async getThesisMetadata(): Promise<ThesisMetadata> {
    const metadata = await this.getUserThesis();

    if (!metadata) {
      throw new Error('Thesis metadata not found. Please initialize the thesis metadata.');
    }

    return metadata;
  }

  static async getThesisStatus(): Promise<string> {
    const metadata = await this.getUserThesis();
    const progress = await this.calculateThesisProgress();

    if (!metadata) return 'Not Started';
    
    if (progress.progressPercentage === 0) return 'Initialized';
    if (progress.progressPercentage < 25) return 'Early Stage';
    if (progress.progressPercentage < 50) return 'Developing';
    if (progress.progressPercentage < 75) return 'Advanced';
    return 'Near Completion';
  }

  static async exportThesisData(): Promise<string> {
    const metadata = await this.getUserThesis();
    const chapters = await this.getChapters();
    const references = await this.getReferences();
    const progress = await this.calculateThesisProgress();
    const status = await this.getThesisStatus();

    return JSON.stringify({
      metadata,
      chapters,
      references,
      progress,
      status
    }, null, 2);
  }

  static async importThesisData(jsonData: string): Promise<void> {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (parsedData.metadata) {
        await this.upsertThesisMetadata(parsedData.metadata);
      }

      // Optionally, you might want to add methods in respective services to handle bulk imports
      if (parsedData.chapters) {
        // You might need to implement a bulk import method in ChapterService
        // For now, this is a placeholder
        for (const chapter of parsedData.chapters) {
          await this.addChapter(chapter);
        }
      }

      if (parsedData.references) {
        // Similar to chapters, you might want a bulk import method
        for (const reference of parsedData.references) {
          await this.addReference(reference);
        }
      }
    } catch (error) {
      throw new Error('Invalid thesis data format');
    }
  }

  static async resetThesis(): Promise<void> {
    // This method would depend on the implementation of your individual services
    // You might want to add reset methods to each service
    const metadata = await this.getUserThesis();
    if (metadata) {
      await MetadataService.resetMetadata();
      await ChapterService.resetChapters();
      await ReferenceService.resetReferences();
      await SectionService.resetSections();
    }
  }
}