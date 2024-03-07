import { bot } from "../app";
import { IUser, IWeek } from "../interfaces/interfaces";
import { Markup } from "telegraf";
import { INotificationService } from "./notificationService.interface";
import { saveNewSnooze } from "../utils/schedulers";

export class NotificationCenter implements INotificationService {
    constructor() {}

    private keyboardOption = {
        onlyGotcha: 0,
        snoozeDone: 1,
        onlyDone: 2,
    };

    async sendNotifications(currentWeek: IWeek, option: number): Promise<void> {
        // 1 - monday, first notification
        // 4 - thursday-saturday, can snooze
        // 7 - sunday, can't snooze
        for (const task of currentWeek.events) {
            const user = task.userId as unknown as IUser;
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
    }

    async sendReminder(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ): Promise<void> {
        console.log(`A reminder to ${userName} sent.`);
        this.sendKeyboard(
            TGId,
            userName,
            area,
            description,
            this.keyboardOption.snoozeDone
        );
    }

    async sendSundayReminder(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ): Promise<void> {
        console.log(`Final reminder to ${userName} sent.`);
        this.sendKeyboard(
            TGId,
            userName,
            area,
            description,
            this.keyboardOption.onlyDone
        );
    }

    async sendChatNotification(currentWeek: IWeek): Promise<void> {
        await bot.telegram.sendMessage(
            process.env.OUR_CHAT as string,
            "THIS WEEK ON DUTY:\n" + currentWeek.summary
        );
    }
    
    private async sendKeyboard(
        TGId: number,
        userName: string,
        area: string,
        description: string,
        option: number
    ): Promise<void> {
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
            await saveNewSnooze(TGId, userName, area, description);
        });
    }
}
