import React from 'react';
import { ThesisMetadata } from '../types';

interface Props {
  metadata: ThesisMetadata;
  onUpdate: (updates: Partial<ThesisMetadata>) => void;
}

export function MetadataForm({ metadata, onUpdate }: Props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Thesis Metadata</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            value={metadata.author || ''}
            onChange={(e) => onUpdate({ author: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">University</label>
          <input
            type="text"
            value={metadata.university || ''}
            onChange={(e) => onUpdate({ university: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Field</label>
          <input
            type="text"
            value={metadata.field || ''}
            onChange={(e) => onUpdate({ field: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Supervisor</label>
          <input
            type="text"
            value={metadata.supervisor || ''}
            onChange={(e) => onUpdate({ supervisor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}