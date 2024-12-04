import { Chapter } from '../../types';
import { LocalStorageService } from '../storage/localStorage';
import { STORAGE_KEYS } from '../storage/keys';

export class ChapterService {
  static async getChapters(): Promise<Chapter[]> {
    const data = LocalStorageService.getItem(STORAGE_KEYS.CHAPTERS);
    return data ? JSON.parse(data) : [];
  }

  static async listChapters(): Promise<Chapter[]> {
    return await this.getChapters();
  }
static async addChapter(chapter: Partial<Chapter>): Promise<Chapter> {
  const chapters = await this.getChapters();
  
  // Generate a short, sequential ID
  const newId = chapters.length + 1;
  
  const newChapter: Chapter = {
    id: newId.toString(), // Convert to string to match the ID type
    title: chapter.title || '',
    sections: chapter.sections || [],
  };
  
  const updatedChapters = [...chapters, newChapter];
  LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(updatedChapters));
  return newChapter;
}

  
  static async updateChapter(id: string, updates: Partial<Chapter>): Promise<Chapter> {
  const chapters = await this.getChapters();
  const chapterIndex = chapters.findIndex(chapter => chapter.id === id);
  
  if (chapterIndex === -1) {
    throw new Error(`Chapter with id ${id} not found`);
  }
  
  const updatedChapter = { ...chapters[chapterIndex], ...updates };
  chapters[chapterIndex] = updatedChapter;
  
  LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  return updatedChapter;
}

  static async editChapter(index: number, updates: Partial<Chapter>): Promise<Chapter> {
    const chapters = await this.getChapters();
    const updatedChapter = { ...chapters[index], ...updates };
    chapters[index] = updatedChapter;
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
    return updatedChapter;
  }

  static async deleteChapter(index: number): Promise<void> {
    const chapters = await this.getChapters();
    chapters.splice(index, 1);
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  }

  static async reorderChapters(reorderedChapters: Chapter[]): Promise<void> {
    LocalStorageService.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(reorderedChapters));
  }
}