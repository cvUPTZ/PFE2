import { Command, CommandResult } from './commandTypes';
import { getCommand } from './commandRegistry';

export class CommandService {
  static async executeCommand(input: string): Promise<CommandResult> {
    const [commandName, ...args] = input.trim().split(/\s+/);
    
    if (!commandName) {
      return {
        success: false,
        message: 'Please enter a command. Use "help" to see available commands.'
      };
    }

    const command = getCommand(commandName.toLowerCase());
    
    if (!command) {
      return {
        success: false,
        message: `Unknown command: ${commandName}. Use "help" to see available commands.`
      };
    }

    try {
      return await command.handler(args);
    } catch (error) {
      return {
        success: false,
        message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}