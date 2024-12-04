import React from 'react';
import { Command } from '../services/commands/commandTypes';
import { getAllCommands } from '../services/commands/commandRegistry';
import {
  BookOpen,
  FileText,
  Eye,
  Download,
  HelpCircle,
  Plus,
  Pencil,
  BookMarked,
  GraduationCap,
  User,
  Library,
  File,
  BookmarkPlus
} from 'lucide-react';

const COMMAND_ICONS: Record<string, React.ReactNode> = {
  start: <BookOpen className="w-5 h-5" />,
  'set-title': <FileText className="w-5 h-5" />,
  'set-field': <GraduationCap className="w-5 h-5" />,
  'set-supervisor': <User className="w-5 h-5" />,
  'set-university': <Library className="w-5 h-5" />,
  'initialize-template': <File className="w-5 h-5" />,
  
  'add-chapter': <Plus className="w-5 h-5" />,
  'list-chapters': <BookOpen className="w-5 h-5" />,
  'edit-chapter': <Pencil className="w-5 h-5" />,
  'delete-chapter': <Pencil className="w-5 h-5" />,
  
  'add-section': <Plus className="w-5 h-5" />,
  'edit-section': <Pencil className="w-5 h-5" />,
  'delete-section': <Pencil className="w-5 h-5" />,
  
  'add-reference': <BookmarkPlus className="w-5 h-5" />,
  'search-references': <BookMarked className="w-5 h-5" />,
  'generate-bibliography': <Library className="w-5 h-5" />,
  'set-citation-style': <BookmarkPlus className="w-5 h-5" />,
  
  'export': <Download className="w-5 h-5" />,
  help: <HelpCircle className="w-5 h-5" />,
  status: <Eye className="w-5 h-5" />,
  about: <HelpCircle className="w-5 h-5" />
};

interface Props {
  onCommandSelect: (command: string) => void;
}

export function Sidebar({ onCommandSelect }: Props) {
  const commands = getAllCommands();
  
  const commandGroups = {
    'Thesis Metadata': [
      'start', 
      'set-title', 
      'set-field', 
      'set-supervisor', 
      'set-university',
      'initialize-template'
    ],
    'Chapter Management': [
      'add-chapter', 
      'list-chapters', 
      'edit-chapter', 
      'delete-chapter'
    ],
    'Section Management': [
      'add-section', 
      'edit-section', 
      'delete-section'
    ],
    'Reference Management': [
      'add-reference', 
      'search-references', 
      'generate-bibliography', 
      'set-citation-style'
    ],
    'Utility Tools': [
      'status', 
      'help', 
      'about', 
      'export'
    ]
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
      <div className="sticky top-0 bg-gray-800 z-10 p-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-6 h-6" />
          <h2 className="text-xl font-bold">Thesis CLI Commands</h2>
        </div>
      </div>
      <div className="p-4">
        {Object.entries(commandGroups).map(([group, commandNames]) => (
          <div key={group} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">{group}</h3>
            <div className="space-y-1">
              {commandNames.map(name => {
                const command = commands.find(cmd => cmd.name === name);
                if (!command) return null;
                return (
                  <button
                    key={name}
                    onClick={() => onCommandSelect(command.name)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors text-left"
                  >
                    {COMMAND_ICONS[name] || <BookOpen className="w-5 h-5" />}
                    <span>{command.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}