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
    }
}
