import mongoose from "mongoose";
import { bot } from "../app";
import { IEvent, IWeek, event, user } from "../interfaces/interfaces";
import { Markup } from "telegraf";
import { Snooze, Week, addNewSnooze, findCurrentWeek } from "./db";

export class NotificationCenter {
    constructor() {}

    async sendNotifications(option: number) {
        // 1 - monday, first notification
        // 4 - thursday-saturday, can snooze
        // 7 - sunday, can't snooze
        const currentWeek = await findCurrentWeek();
        if (currentWeek) {
            for (const task of currentWeek.events) {
                const user = task.userId as unknown as user;
                const TGId = user.TG.tgId;
                const userName = user.name;
                const area = task.area;
                const description = task.description;

                if (option === 1) {
                    this.responseKeyboard(TGId, userName, area, description, 0);
                }
                if (option === 4) {
                    this.responseKeyboard(TGId, userName, area, description, 1);
                }
                if (option === 7) {
                    this.responseKeyboard(TGId, userName, area, description, 2);
                }
            }
        } else {
            console.warn(`Record ${currentWeek} not found in the db.`);
        }
    }

    async sendReminder(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ) {
        console.log(`A reminder to ${userName} sent.`);
        this.responseKeyboard(TGId, userName, area, description, 1);
    }

    async chatNotification() {
        const currentWeek = await findCurrentWeek();
        let chatMessage = "THIS WEEK ON DUTY:\n";
        if (currentWeek) {
            chatMessage += currentWeek.summary;
            await bot.telegram.sendMessage(
                process.env.OUR_CHAT as string,
                chatMessage
            );
        }
    }

    private async responseKeyboard(
        TGId: number,
        userName: string,
        area: string,
        description: string,
        option: number
    ) {
        // option:
        // 0 - monday notification, only with one "Gotcha" button
        // 1 - two options, button "Done" and "Snooze"
        // 2 - last notification option, can't snooze, only "Done" left
        let text: string = "";
        let keyboard;

        if (option === 0) {
            text = `Congratulations! This week you are responsible for ${area}!\n
            Your tasks are:\n ${description}`;
            keyboard = Markup.inlineKeyboard([
                Markup.button.callback("Gotcha 👍", "cb 0"),
            ]);
        }

        if (option === 1) {
            text = `Reminder! This week you are responsible for ${area}!
            Here's what you should do:\n ${description}`;
            keyboard = [
                [Markup.button.callback("The job is done! 🤌 🕶️", "cb 1")],
                [Markup.button.callback("Snooze... 🦥", "cb 2")],
            ];
        }

        if (option === 2) {
            text = `Final reminder! Please clean the ${area}!
            Your tasks are:\n ${description}`;
            keyboard = [
                [
                    Markup.button.callback(
                        "No more snoozes, do it and hit me 👍",
                        "cb 0"
                    ),
                ],
            ];
        }

        await bot.telegram.sendMessage(
            TGId,
            text,
            Markup.inlineKeyboard(keyboard as any)
        );

        bot.action("cb 0", ctx => {
            console.log(`${userName} recieved the task.`);
            ctx.sendMessage("Cool!");
        });
        bot.action("cb 1", ctx => {
            console.log(`${userName} has done his job.`);
            ctx.editMessageText("You're the best ... around! 🏆");
        });
        bot.action("cb 2", async ctx => {
            console.log(`${userName} snoozed his task.`);
            ctx.editMessageText("Ok, I'll remind you tomorrow.");
            await addNewSnooze(TGId, userName, area, description);
        });
    }
}
