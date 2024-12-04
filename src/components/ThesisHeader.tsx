import React from 'react';
import { BookOpen, GraduationCap, User } from 'lucide-react';
import { ThesisMetadata } from '../types';

interface Props {
  metadata: ThesisMetadata | null;
}

export function ThesisHeader({ metadata }: Props) {
  if (!metadata) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">{metadata.title || 'Untitled Thesis'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <span>{metadata.author || 'No author set'}</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gray-600" />
          <span>{metadata.university || 'No university set'}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <span>{metadata.field || 'No field set'}</span>
        </div>
      </div>
    </div>
  );
}