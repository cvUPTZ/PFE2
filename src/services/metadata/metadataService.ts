import { ThesisMetadata } from '../../types';
import { LocalStorageService } from '../storage/localStorage';
import { STORAGE_KEYS } from '../storage/keys';

export class MetadataService {
  static async getUserThesis(): Promise<ThesisMetadata | null> {
    const data = LocalStorageService.getItem(STORAGE_KEYS.THESIS_METADATA);
    return data ? JSON.parse(data) : null;
  }

  static async upsertThesisMetadata(updates: Partial<ThesisMetadata>): Promise<ThesisMetadata> {
    const current = await this.getUserThesis();
    const updated = {
      ...current,
      ...updates,
      id: current?.id || crypto.randomUUID(),
    };
    LocalStorageService.setItem(STORAGE_KEYS.THESIS_METADATA, JSON.stringify(updated));
    return updated;
  }
}