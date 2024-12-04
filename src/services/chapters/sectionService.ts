import { Chapter, Section } from '../../types';
import { LocalStorageService } from '../storage/localStorage';
import { STORAGE_KEYS } from '../storage/keys';
import { ChapterService } from './chapterService';

export class SectionService {
  static async listSections(chapterId?: string): Promise<Section[]> {
    const chapters = await ChapterService.getChapters();
    
    if (chapterId) {
      const chapter = chapters.find(c => c.id === chapterId);
      return chapter ? chapter.sections : [];
    }
    
    return chapters.flatMap(chapter => chapter.sections);
  }

  static async addSection(chapterId: string, sectionData: Partial<Section>): Promise<Section> {
    // Retrieve all chapters
    const chapters = await ChapterService.getChapters();
    
    // Find the specific chapter
    const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    
    if (chapterIndex === -1) {
      throw new Error(`Chapter with ID ${chapterId} not found`);
    }
    
    // Find the maximum existing section ID in this chapter
    const maxSectionId = chapters[chapterIndex].sections.reduce((max, section) => 
      Math.max(max, parseInt(section.id || '0')), 0);
    
    // Create new section with incremental ID
    const newSection: Section = {
      id: (maxSectionId + 1).toString(),
      title: sectionData.title || '',
      content: sectionData.content || '',
    };
    
    // Add the new section to the chapter
    chapters[chapterIndex].sections.push(newSection);
    
    // Save updated chapters
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
    
    return newSection;
  }

  static async editSection(chapterId: string, sectionId: string, updates: Partial<Section>): Promise<Section> {
    const chapters = await ChapterService.getChapters();
    
    // Find the specific chapter
    const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    
    if (chapterIndex === -1) {
      throw new Error(`Chapter with ID ${chapterId} not found`);
    }
    
    // Find the specific section
    const sectionIndex = chapters[chapterIndex].sections.findIndex(section => section.id === sectionId);
    
    if (sectionIndex === -1) {
      throw new Error(`Section with ID ${sectionId} not found in chapter ${chapterId}`);
    }
    
    // Update the section
    const updatedSection = {
      ...chapters[chapterIndex].sections[sectionIndex],
      ...updates
    };
    
    // Replace the section in the chapter
    chapters[chapterIndex].sections[sectionIndex] = updatedSection;
    
    // Save updated chapters
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
    
    return updatedSection;
  }

  static async deleteSection(chapterId: string, sectionId: string): Promise<void> {
    const chapters = await ChapterService.getChapters();
    
    // Find the specific chapter
    const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    
    if (chapterIndex === -1) {
      throw new Error(`Chapter with ID ${chapterId} not found`);
    }
    
    // Remove the section
    chapters[chapterIndex].sections = chapters[chapterIndex].sections.filter(
      section => section.id !== sectionId
    );
    
    // Save updated chapters
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  }

  static async mergeSections(
    sourceChapterId: string, 
    sourceId: string, 
    targetChapterId: string, 
    targetId: string
  ): Promise<Section> {
    const chapters = await ChapterService.getChapters();
    
    // Find source chapter and section
    const sourceChapterIndex = chapters.findIndex(chapter => chapter.id === sourceChapterId);
    const sourceSection = chapters[sourceChapterIndex].sections.find(section => section.id === sourceId);
    
    // Find target chapter and section
    const targetChapterIndex = chapters.findIndex(chapter => chapter.id === targetChapterId);
    const targetSectionIndex = chapters[targetChapterIndex].sections.findIndex(section => section.id === targetId);
    
    if (!sourceSection) {
      throw new Error(`Source section ${sourceId} not found in chapter ${sourceChapterId}`);
    }
    
    if (targetSectionIndex === -1) {
      throw new Error(`Target section ${targetId} not found in chapter ${targetChapterId}`);
    }
    
    // Merge content
    const mergedSection = {
      ...chapters[targetChapterIndex].sections[targetSectionIndex],
      content: `${chapters[targetChapterIndex].sections[targetSectionIndex].content}\n\n${sourceSection.content}`
    };
    
    // Update target section
    chapters[targetChapterIndex].sections[targetSectionIndex] = mergedSection;
    
    // Remove source section
    chapters[sourceChapterIndex].sections = chapters[sourceChapterIndex].sections.filter(
      section => section.id !== sourceId
    );
    
    // Save updated chapters
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
    
    return mergedSection;
  }
}