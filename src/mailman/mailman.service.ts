import { Context, Telegraf } from "telegraf";
import { IMailman } from "./mailman.interface";
import { Update } from "telegraf/typings/core/types/typegram";
import { MessageType } from "../utils/types";

export class MailmanService implements IMailman {
    private bot: Telegraf<Context<Update>>;

    constructor(bot: Telegraf<Context<Update>>) {
        this.bot = bot;
    }

    async sendToTg(message: MessageType, msgId?: number): Promise<void> {
        if (msgId && message.text) {
            await this.bot.telegram.editMessageText(
                message.ID,
                msgId,
                "sdfg",
                message.text
            );
        }
        if (message.imgUrl) {
            await this.bot.telegram.sendPhoto(
                message.ID,
                message.imgUrl,
                message.imgCap
            );
        }
        if (message.text) {
            await this.bot.telegram.sendMessage(
                message.ID,
                message.text,
                message.markup
            );
        }
    }
}
