import { Context, Telegraf } from "telegraf";
import { IMailman } from "./mailman.interface";
import { Update } from "telegraf/typings/core/types/typegram";
import { MessageType } from "../utils/types";
import { tgUserReplyOption } from "../utils/constants";

export class MailmanService implements IMailman {
    private bot: Telegraf<Context<Update>>;

    constructor(bot: Telegraf<Context<Update>>) {
        this.bot = bot;
    }

    async sendToTG(message: MessageType): Promise<void> {
        await this.bot.telegram.sendMessage(
            message.ID,
            message.text,
            message.markup
        );

        // this.bot.action(tgUserReplyOption.confirm, async (ctx: Context) => {
        //     const userName = ctx.from?.username;
        //     const userId = ctx.from?.id;
        //     console.log(`${userName} recieved his task.`);
        //     const messageText = ctx.text;
        //     if (messageText) {
        //         const area = messageText.split(" ")[0];
        //     }
        //     await ctx.sendMessage("Cool!");
        // });
        // this.bot.action(tgUserReplyOption.done, async (ctx: Context) => {
        //     console.log(`User has done his job.`);
        //     await ctx.editMessageText("You're the best ... around! 🏆");
        // });
        // this.bot.action(tgUserReplyOption.snooze, async (ctx: Context) => {
        //     console.log(`User snoozed his task.`);
        //     await ctx.editMessageText("Ok, I'll remind you tomorrow.");
        // });
    }
}
