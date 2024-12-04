export type CommandResult = {
  success: boolean;
  message: string;
  data?: any;
};

export type CommandHandler = (args: string[]) => Promise<CommandResult>;

export type Command = {
  name: string;
  description: string;
  usage: string;
  handler: CommandHandler;
};