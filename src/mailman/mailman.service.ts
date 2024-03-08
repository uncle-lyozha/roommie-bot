import { Context, Markup, Telegraf } from "telegraf";
import { IMailman } from "./mailman.interface";
import { Update } from "telegraf/typings/core/types/typegram";

export class MailmanService implements IMailman {
    private bot: Telegraf<Context<Update>>;

    constructor(bot: Telegraf<Context<Update>>) {
        this.bot = bot;
    }

    async sendToTG(
        ID: number,
        message: string,
        keyboard?: any[]
    ): Promise<void> {
        await this.bot.telegram.sendMessage(
            ID,
            message,
            Markup.inlineKeyboard(keyboard as any)
        );
    }
}
