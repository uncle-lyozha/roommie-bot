import { Context, Telegraf } from "telegraf";
import { IMailman } from "./mailman.interface";
import { Update } from "telegraf/typings/core/types/typegram";
import { MessageType } from "../utils/types";

export class MailmanService implements IMailman {
    private bot: Telegraf<Context<Update>>;

    constructor(bot: Telegraf<Context<Update>>) {
        this.bot = bot;
    }

    async sendToTg(message: MessageType): Promise<void> {
        if (message.imgUrl) {
            await this.bot.telegram.sendPhoto(
                message.ID,
                message.imgUrl,
                message.imgCap
            );
            return;
        }
        if (message.text) {
            await this.bot.telegram.sendMessage(
                message.ID,
                message.text,
                message.markup
            );
            return;
        }
    }

    async sendKeyboardToTG(message: MessageType): Promise<void> {
        if (message.text) {
            await this.bot.telegram.sendMessage(
                message.ID,
                message.text,
                message.markup
            );
        } else {
            console.error("message.text is absent.");
        }
    }

    async sendPictureToTG(message: MessageType): Promise<void> {
        if (message.imgUrl) {
            await this.bot.telegram.sendPhoto(
                message.ID,
                message.imgUrl,
                message.imgCap
            );
        } else {
            console.error("Mailman has no picture to send.");
        }
    }
}
