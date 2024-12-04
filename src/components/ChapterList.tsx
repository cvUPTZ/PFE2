import React from 'react';
import { Chapter } from '../types';

interface Props {
  chapters: Chapter[];
  onEditChapter: (index: number) => void;
  onDeleteChapter: (index: number) => void;
  onReorderChapter: (fromIndex: number, toIndex: number) => void;
}

export function ChapterList({ chapters }: Props) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Chapter {index + 1}: {chapter.title}
            </h3>
          </div>
          {chapter.sections.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              {chapter.sections.map((section) => (
                <div key={section.id} className="mt-2">
                  <h4 className="font-medium">{section.title}</h4>
                  <p className="text-gray-600 mt-1">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}