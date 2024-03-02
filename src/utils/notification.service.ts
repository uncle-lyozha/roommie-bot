import { bot } from "../app";
import { user } from "../interfaces/interfaces";
import { Markup } from "telegraf";
import { addNewSnooze, findCurrentWeek } from "./db";

export class NotificationCenter {
    constructor() {}

    private keyboardOption = {
        onlyGotcha: 0,
        snoozeDone: 1,
        onlyDone: 2,
    };

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

                switch (option) {
                    case 1:
                        this.sendKeyboard(
                            TGId,
                            userName,
                            area,
                            description,
                            this.keyboardOption.onlyGotcha
                        );
                        break;
                    case 4:
                        this.sendKeyboard(
                            TGId,
                            userName,
                            area,
                            description,
                            this.keyboardOption.snoozeDone
                        );
                        break;
                    case 7:
                        this.sendKeyboard(
                            TGId,
                            userName,
                            area,
                            description,
                            this.keyboardOption.onlyDone
                        );
                        break;
                }
            }
        } else {
            throw new Error("Current week not found");
        }
    }

    async sendReminder(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ) {
        console.log(`A reminder to ${userName} sent.`);
        this.sendKeyboard(
            TGId,
            userName,
            area,
            description,
            this.keyboardOption.snoozeDone
        );
    }

    async sendChatNotification() {
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

    private async sendKeyboard(
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

        switch (option) {
            case 0:
                text = `Congratulations! This week you are responsible for ${area}!\n
                Your tasks are:\n ${description}`;
                keyboard = [[Markup.button.callback("Gotcha 👍", "confirm")]];
                break;
            case 1:
                text = `Reminder! This week you are responsible for ${area}!
                Here's what you should do:\n ${description}`;
                keyboard = [
                    [Markup.button.callback("The job is done! 🤌 🕶️", "done")],
                    [Markup.button.callback("Snooze... 🦥", "snooze")],
                ];
                break;
            case 2:
                text = `Final reminder! Please clean the ${area}!
                Your tasks are:\n ${description}`;
                keyboard = [
                    [
                        Markup.button.callback(
                            "No more snoozes, do it and hit me 👍",
                            "done"
                        ),
                    ],
                ];
                break;
        }

        await bot.telegram.sendMessage(
            TGId,
            text,
            Markup.inlineKeyboard(keyboard as any)
        );

        bot.action("confirm", ctx => {
            console.log(`${userName} recieved the task.`);
            ctx.sendMessage("Cool!");
        });
        bot.action("done", ctx => {
            console.log(`${userName} has done his job.`);
            ctx.editMessageText("You're the best ... around! 🏆");
        });
        bot.action("snooze", async ctx => {
            console.log(`${userName} snoozed his task.`);
            ctx.editMessageText("Ok, I'll remind you tomorrow.");
            await addNewSnooze(TGId, userName, area, description);
        });
    }
}
