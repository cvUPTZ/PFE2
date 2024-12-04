import { Reference, CitationStyle } from '../../types';
import { LocalStorageService } from '../storage/localStorage';
import { STORAGE_KEYS } from '../storage/keys';

export class ReferenceService {
  static async getReferences(): Promise<Reference[]> {
    const data = LocalStorageService.getItem(STORAGE_KEYS.REFERENCES);
    return data ? JSON.parse(data) : [];
  }

  static async addReference(reference: Partial<Reference>): Promise<Reference> {
    const references = await this.getReferences();
    const newReference: Reference = {
      id: crypto.randomUUID(),
      type: reference.type || 'book',
      ...reference,
      createdAt: new Date().toISOString()
    };

    const updatedReferences = [...references, newReference];
    LocalStorageService.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(updatedReferences));
    return newReference;
  }

  static async searchReferences(query: string): Promise<Reference[]> {
    const references = await this.getReferences();
    return references.filter(ref => 
      Object.values(ref).some(value => 
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  static async deleteReference(id: string): Promise<void> {
    const references = await this.getReferences();
    const filteredReferences = references.filter(ref => ref.id !== id);
    LocalStorageService.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(filteredReferences));
  }

  static async generateBibliography(style: CitationStyle = 'APA'): Promise<string[]> {
    const references = await this.getReferences();
    
    // Basic bibliography generation (you'd want to implement proper citation formatting)
    return references.map(ref => {
      switch (style) {
        case 'APA':
          return this.formatAPACitation(ref);
        case 'MLA':
          return this.formatMLACitation(ref);
        case 'Chicago':
          return this.formatChicagoCitation(ref);
        default:
          return this.formatAPACitation(ref);
      }
    });
  }

  static async setCitationStyle(style: CitationStyle): Promise<void> {
    LocalStorageService.setItem(STORAGE_KEYS.CITATION_STYLE, style);
  }

  static async getCurrentCitationStyle(): Promise<CitationStyle> {
    return LocalStorageService.getItem(STORAGE_KEYS.CITATION_STYLE) as CitationStyle || 'APA';
  }

  // Basic citation formatting methods (these would need to be much more sophisticated)
  private static formatAPACitation(ref: Reference): string {
    // Implement APA formatting logic
    return `${ref.author}. (${ref.year}). ${ref.title}. ${ref.publisher}.`;
  }

  private static formatMLACitation(ref: Reference): string {
    // Implement MLA formatting logic
    return `${ref.author}. "${ref.title}." ${ref.publisher}, ${ref.year}.`;
  }

  private static formatChicagoCitation(ref: Reference): string {
    // Implement Chicago formatting logic
    return `${ref.author}. ${ref.title}. ${ref.publisher}, ${ref.year}.`;
  }
}