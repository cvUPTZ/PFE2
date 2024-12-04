import { Command } from './commandTypes';
import { ThesisService } from '../ThesisService';
import { ChapterService } from '../chapters/chapterService';
import { SectionService } from '../chapters/sectionService';
import { ReferenceService } from '../references/referenceService';
import { ExportService} from '../export/exportService'
const commands: Record<string, Command> = {
  // Thesis Metadata Commands
  'start': {
    name: 'start',
    description: 'Initialize a new thesis project',
    usage: 'start <title>',
    handler: async (args) => {
      const title = args.join(' ');
      if (!title) {
        return { success: false, message: 'Please provide a thesis title' };
      }
      const thesis = await ThesisService.upsertThesisMetadata({ title });
      return { success: true, message: 'Thesis project initialized', data: thesis };
    },
  },

  'set-title': {
    name: 'set-title',
    description: 'Set the thesis title',
    usage: 'set-title <title>',
    handler: async (args) => {
      const title = args.join(' ');
      if (!title) {
        return { success: false, message: 'Please provide a thesis title' };
      }
      const thesis = await ThesisService.upsertThesisMetadata({ title });
      return { success: true, message: 'Thesis title updated', data: thesis };
    },
  },

  'set-field': {
    name: 'set-field',
    description: 'Set the thesis field of study',
    usage: 'set-field <field>',
    handler: async (args) => {
      const field = args.join(' ');
      if (!field) {
        return { success: false, message: 'Please provide a field of study' };
      }
      const thesis = await ThesisService.upsertThesisMetadata({ field });
      return { success: true, message: 'Field of study updated', data: thesis };
    },
  },

  'set-supervisor': {
    name: 'set-supervisor',
    description: 'Set the thesis supervisor',
    usage: 'set-supervisor <name>',
    handler: async (args) => {
      const supervisor = args.join(' ');
      if (!supervisor) {
        return { success: false, message: 'Please provide a supervisor name' };
      }
      const thesis = await ThesisService.upsertThesisMetadata({ supervisor });
      return { success: true, message: 'Supervisor updated', data: thesis };
    },
  },

  'set-university': {
    name: 'set-university',
    description: 'Set the university for the thesis',
    usage: 'set-university <name>',
    handler: async (args) => {
      const university = args.join(' ');
      if (!university) {
        return { success: false, message: 'Please provide a university name' };
      }
      const thesis = await ThesisService.upsertThesisMetadata({ university });
      return { success: true, message: 'University updated', data: thesis };
    },
  },

  'initialize-template': {
    name: 'initialize-template',
    description: 'Initialize a formatting template for the thesis',
    usage: 'initialize-template <APA|MLA|Chicago>',
    handler: async (args) => {
      const template = args[0]?.toUpperCase();
      if (!['APA', 'MLA', 'CHICAGO'].includes(template)) {
        return { success: false, message: 'Please provide a valid template (APA, MLA, or Chicago)' };
      }
      const thesis = await ThesisService.upsertThesisMetadata({ template });
      return { success: true, message: 'Template set successfully', data: thesis };
    },
  },

  // Chapter Commands
'add-chapter': {
  name: 'add-chapter',
  description: 'Add a new chapter to the thesis',
  usage: 'add-chapter <title>',
  handler: async (args) => {
    const title = args.join(' ').trim();
    if (!title) {
      return { 
        success: false, 
        message: 'Please provide a chapter title' 
      };
    }
    
    try {
      const chapter = await ChapterService.addChapter({ title });
      return { 
        success: true, 
        message: `Chapter "${title}" added successfully`, 
        data: chapter 
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add chapter: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
},

  
  'list-chapters': {
  name: 'list-chapters',
  description: 'List all thesis chapters',
  usage: 'list-chapters',
  handler: async () => {
    try {
      const chapters = await ChapterService.listChapters();
      
      if (chapters.length === 0) {
        return { 
          success: true, 
          message: 'No chapters found. Use "add-chapter" to create your first chapter.',
          data: chapters 
        };
      }
      
      return { 
        success: true, 
        message: `Found ${chapters.length} chapter(s)`, 
        data: chapters 
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list chapters: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
},
  'edit-chapter': {
  name: 'edit-chapter',
  description: 'Edit a thesis chapter',
  usage: 'edit-chapter <id> <title>',
  handler: async (args) => {
    const [id, ...titleParts] = args;
    const title = titleParts.join(' ').trim();
    
    if (!id) {
      return { 
        success: false, 
        message: 'Please provide a chapter ID' 
      };
    }
    
    if (!title) {
      return { 
        success: false, 
        message: 'Please provide a new title for the chapter' 
      };
    }
    
    try {
      const chapter = await ChapterService.updateChapter(id, { title });
      return { 
        success: true, 
        message: `Chapter ${id} updated successfully to "${title}"`, 
        data: chapter 
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update chapter: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
},
  
  'delete-chapter': {
    name: 'delete-chapter',
    description: 'Remove a chapter from the thesis',
    usage: 'delete-chapter <id>',
    handler: async (args) => {
      const id = args[0];
      if (!id) {
        return { success: false, message: 'Please provide a chapter ID' };
      }
      await ChapterService.deleteChapter(id);
      return { success: true, message: 'Chapter deleted successfully' };
    },
  },

 'list-sections': {
  name: 'list-sections',
  description: 'List sections for a specific chapter or all chapters',
  usage: 'list-sections [chapterId]',
  handler: async (args) => {
    const chapterId = args[0];
    
    try {
      const sections = await SectionService.listSections(chapterId);
      
      if (sections.length === 0) {
        return { 
          success: true, 
          message: chapterId 
            ? `No sections found in chapter ${chapterId}` 
            : 'No sections found in any chapter',
          data: sections 
        };
      }
      
      return { 
        success: true, 
        message: chapterId 
          ? `Sections for chapter ${chapterId}` 
          : `Found ${sections.length} section(s)`, 
        data: sections 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to retrieve sections' 
      };
    }
  },
},

'add-section': {
  name: 'add-section',
  description: 'Add a new section to a specific chapter',
  usage: 'add-section <chapterId> <title> [content]',
  handler: async (args) => {
    if (args.length < 2) {
      return { 
        success: false, 
        message: 'Please provide chapter ID and section title' 
      };
    }

    const chapterId = args[0].trim();
    const title = args[1].trim();
    const content = args.slice(2).join(' ').trim() || '';

    if (!chapterId) {
      return { 
        success: false, 
        message: 'Chapter ID cannot be empty' 
      };
    }

    if (!title) {
      return { 
        success: false, 
        message: 'Section title cannot be empty' 
      };
    }

    try {
      const section = await SectionService.addSection(chapterId, { title, content });
      return { 
        success: true, 
        message: `Section "${title}" added to chapter ${chapterId} successfully`, 
        data: section 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to add section' 
      };
    }
  },
},

'edit-section': {
  name: 'edit-section',
  description: 'Edit a section in a specific chapter',
  usage: 'edit-section <chapterId> <sectionId> <title|content> <new-value>',
  handler: async (args) => {
    if (args.length < 4) {
      return { 
        success: false, 
        message: 'Please provide chapter ID, section ID, field to edit, and new value' 
      };
    }

    const [chapterId, sectionId, field, ...valueParts] = args;
    const value = valueParts.join(' ').trim();

    if (!['title', 'content'].includes(field)) {
      return { 
        success: false, 
        message: 'Can only edit title or content' 
      };
    }

    if (!value) {
      return { 
        success: false, 
        message: `New ${field} cannot be empty` 
      };
    }

    try {
      const updates: { title?: string, content?: string } = {};
      updates[field as 'title' | 'content'] = value;

      const section = await SectionService.editSection(chapterId, sectionId, updates);
      return { 
        success: true, 
        message: `Section ${sectionId} in chapter ${chapterId} updated successfully`, 
        data: section 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to edit section' 
      };
    }
  },
},

'delete-section': {
  name: 'delete-section',
  description: 'Delete a section from a specific chapter',
  usage: 'delete-section <chapterId> <sectionId>',
  handler: async (args) => {
    if (args.length < 2) {
      return { 
        success: false, 
        message: 'Please provide chapter ID and section ID' 
      };
    }

    const [chapterId, sectionId] = args;

    try {
      await SectionService.deleteSection(chapterId, sectionId);
      return { 
        success: true, 
        message: `Section ${sectionId} deleted from chapter ${chapterId} successfully` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete section' 
      };
    }
  },
},

'merge-sections': {
  name: 'merge-sections',
  description: 'Merge two sections, moving content from source to target',
  usage: 'merge-sections <sourceChapterId> <sourceId> <targetChapterId> <targetId>',
  handler: async (args) => {
    if (args.length < 4) {
      return { 
        success: false, 
        message: 'Please provide source chapter ID, source section ID, target chapter ID, and target section ID' 
      };
    }

    const [sourceChapterId, sourceId, targetChapterId, targetId] = args;

    try {
      const mergedSection = await SectionService.mergeSections(
        sourceChapterId, 
        sourceId, 
        targetChapterId, 
        targetId
      );
      return { 
        success: true, 
        message: `Section ${sourceId} from chapter ${sourceChapterId} merged into section ${targetId} of chapter ${targetChapterId}`, 
        data: mergedSection 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to merge sections' 
      };
    }
  },
},
  // Reference Commands
  'add-reference': {
    name: 'add-reference',
    description: 'Add a new reference to the thesis bibliography',
    usage: 'add-reference <type> <field1=value1> <field2=value2>...',
    handler: async (args) => {
      if (args.length < 1) {
        return { success: false, message: 'Please provide reference details' };
      }

      const type = args[0];
      const referenceDetails: Record<string, string> = { type };

      // Parse additional fields
      for (const arg of args.slice(1)) {
        const [key, value] = arg.split('=');
        if (key && value) {
          referenceDetails[key] = value;
        }
      }

      try {
        const reference = await ReferenceService.addReference(referenceDetails);
        return { 
          success: true, 
          message: 'Reference added successfully', 
          data: reference 
        };
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to add reference' 
        };
      }
    },
  },

  'list-references': {
    name: 'list-references',
    description: 'List all references in the thesis bibliography',
    usage: 'list-references',
    handler: async () => {
      const references = await ReferenceService.getReferences();
      return { 
        success: true, 
        message: 'References retrieved', 
        data: references 
      };
    },
  },

  'search-references': {
    name: 'search-references',
    description: 'Search references by query',
    usage: 'search-references <query>',
    handler: async (args) => {
      const query = args.join(' ');
      if (!query) {
        return { success: false, message: 'Please provide a search query' };
      }

      const references = await ReferenceService.searchReferences(query);
      return { 
        success: true, 
        message: 'References searched', 
        data: references 
      };
    },
  },

  'delete-reference': {
    name: 'delete-reference',
    description: 'Delete a reference by its ID',
    usage: 'delete-reference <id>',
    handler: async (args) => {
      const id = args[0];
      if (!id) {
        return { success: false, message: 'Please provide a reference ID' };
      }

      try {
        await ReferenceService.deleteReference(id);
        return { 
          success: true, 
          message: 'Reference deleted successfully' 
        };
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to delete reference' 
        };
      }
    },
  },

  'generate-bibliography': {
    name: 'generate-bibliography',
    description: 'Generate bibliography in specified citation style',
    usage: 'generate-bibliography [APA|MLA|Chicago]',
    handler: async (args) => {
      const style = args[0]?.toUpperCase() as 'APA' | 'MLA' | 'CHICAGO' | undefined;
      
      try {
        const bibliography = await ReferenceService.generateBibliography(style);
        return { 
          success: true, 
          message: 'Bibliography generated', 
          data: bibliography 
        };
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to generate bibliography' 
        };
      }
    },
  },

  'set-citation-style': {
    name: 'set-citation-style',
    description: 'Set the default citation style',
    usage: 'set-citation-style <APA|MLA|Chicago>',
    handler: async (args) => {
      const style = args[0]?.toUpperCase();
      if (!['APA', 'MLA', 'CHICAGO'].includes(style)) {
        return { success: false, message: 'Please provide a valid citation style (APA, MLA, or Chicago)' };
      }

      try {
        await ReferenceService.setCitationStyle(style);
        return { 
          success: true, 
          message: `Citation style set to ${style}` 
        };
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to set citation style' 
        };
      }
    },
  },

  'export': {
  name: 'export',
  description: 'Export thesis to a Word document',
  usage: 'export <filename>',
  handler: async (args) => {
    const [filename] = args;

    if (!filename) {
      return { 
        success: false, 
        message: 'Please provide a filename (e.g., export thesis.docx)' 
      };
    }

    try {
      // Retrieve thesis metadata and chapters
      const metadata = await ThesisService.getThesisMetadata(); // Assuming metadata retrieval
      const chapters = await ThesisService.getChapters(); // Assuming chapters retrieval

      // Use the ExportService to generate the document
      await ExportService.exportToWord(metadata, chapters);

      return { 
        success: true, 
        message: `Successfully exported thesis to ${filename}` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to export thesis: ${error.message}` 
      };
    }
  },
},

};

export const getCommand = (name: string): Command | undefined => commands[name];
export const getAllCommands = (): Command[] => Object.values(commands);