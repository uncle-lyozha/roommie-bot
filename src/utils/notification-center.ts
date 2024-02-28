import mongoose from "mongoose";
import { bot } from "../app";
import { WeekSchema } from "../schemas/week.schema";
import { UserSchema } from "../schemas/user.schema";
import { IEvent, IWeek, event, user } from "../interfaces/interfaces";
import { Markup } from "telegraf";
import * as cron from "node-cron";

export class NotificationCenter {
    constructor() {}

    private Week = mongoose.model("Week", WeekSchema);
    private User = mongoose.model("User", UserSchema);

    async bell(day: number) {
        const currentWeek = await this.Week.findOne({
            isCurrent: true,
        }).populate("events.userId");
        if (currentWeek) {
            // this.chatNotification(currentWeek);
            for (const task of currentWeek.events) {
                const user = task.userId as unknown as user;
                if (day === 1) {
                    this.mondayBell(user, task);
                }
                if (day === 4) {
                    this.thursdayBell(user, task);
                }
            }
        } else {
            console.warn(`Record ${currentWeek} not found in the db.`);
        }
    }

    async mondayBell(user: user, task: IEvent) {
        await bot.telegram.sendMessage(
            user.TG.tgId,
            `Congratulations! This week you are responsible for ${task.area}!\n
                    Your tasks are:\n ${task.description}`,
            Markup.inlineKeyboard([
                [Markup.button.callback("Gotcha 👍", "cb 1")],
            ])
        );
        bot.action("cb 1", ctx => {
            ctx.editMessageText("Cool!");
        });
    }

    async thursdayBell(user: user, task: IEvent) {
        const userTGId = user.TG.tgId;
        await bot.telegram.sendMessage(
            userTGId,
            `Reminder! This week you are responsible for ${task.area}!
            Your tasks are:\n ${task.description}`,
            Markup.inlineKeyboard([
                [Markup.button.callback("My job is done! 🤌", "cb 1")],
                [Markup.button.callback("Snooze... 🦥", "cb 2")],
            ])
        );
        bot.action("cb 1", ctx => {
            console.log(`${user.name} has done his job.`);
            ctx.editMessageText("You're the best ... around! 🏆");
        });
        bot.action("cb 2", ctx => {
            console.log(`${user.name} snoozed his task.`);
            ctx.editMessageText("Ok, I'll remind you tomorrow.");
            // snooze logic
            
        });
    }

    async chatNotification(currentWeek: IWeek) {
        let chatMessage = "THIS WEEK ON DUTY:\n";
        chatMessage += currentWeek.summary;
        await bot.telegram.sendMessage(
            process.env.OUR_CHAT as string,
            chatMessage
        );
    }
}
