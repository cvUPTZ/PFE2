import React, { useState, KeyboardEvent } from 'react';
import { Terminal } from 'lucide-react';
import { CommandService } from '../services/commands/commandService';

interface Props {
  onCommandResult: (result: { success: boolean; message: string }) => void;
}

export function CommandInput({ onCommandResult }: Props) {
  const [command, setCommand] = useState('');

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim()) {
      const result = await CommandService.executeCommand(command);
      onCommandResult(result);
      setCommand('');
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Terminal className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Type a command (help for list of commands)"
      />
    </div>
  );
}