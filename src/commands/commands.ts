import { Context } from "telegraf";

interface ICommand {
    description: string,
    handler: (ctx: Context) => Promise<void> | void;
}

const commands: { [key: string]: ICommand} = {
    
}