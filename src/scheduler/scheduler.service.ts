import * as cron from "node-cron";
import { IScheduler } from "./scheduler.interface";
import { IMailman } from "../mailman/mailman.interface";
import { DBService } from "../db/db.service";
import { CalendarService } from "../calendar/calendar.service";
import { MailmanService } from "../mailman/mailman.service";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { callbackQuery } from "telegraf/filters";
import { nostromoChatOpt, tgUserReplyOption } from "../utils/constants";
import { MessageType, TaskType } from "../utils/types";
import { error } from "console";
import { msgImage } from "../utils/images";
import { MessageService } from "../composer/message.service";

export class SchedulerService implements IScheduler {
    private readonly bot: Telegraf<Context<Update>>;
    private readonly calendar = new CalendarService();
    private readonly DB = new DBService(this.calendar);
    private readonly composer = new MessageService();
    private readonly mailman: IMailman;

    constructor(bot: Telegraf<Context<Update>>) {
        this.bot = bot;
        this.mailman = new MailmanService(this.bot);
    }

    async monday() {
        cron.schedule("0 11 * * 1", async () => {
            console.log("For whom the Monday bell tolls.");
            await this.DB.setFailedTaskStatuses();
            await this.DB.populateTasks();
            const newTasks = await this.DB.fetchNewTasks();
            const chatMessage = this.composer.talkNostromo(
                nostromoChatOpt.schedule,
                newTasks
            );
            await this.mailman.sendToTg(chatMessage);
            for (const task of newTasks) {
                const privateMessage = this.composer.talkDallas(task);
                await this.mailman.sendToTg(privateMessage);
            }
        });
    }

    async repeating() {
        cron.schedule("0 11 * * 4-6", async () => {
            console.log("For whom the repeating bell tolls.");
            const tasks = await this.DB.fetchPendingTasks();
            for (const task of tasks) {
                const privateMessage = this.composer.talkRipley(task);
                await this.mailman.sendToTg(privateMessage);
            }
        });
    }

    async sunday() {
        cron.schedule("0 11 * * 7", async () => {
            console.log("For whom the sunday bell tolls.");
            const tasks = await this.DB.fetchPendingTasks();
            for (const task of tasks) {
                const privateMessage = this.composer.talkKane(task);
                await this.mailman.sendToTg(privateMessage);
            }
        });
    }

    listener() {
        this.bot.on(callbackQuery("data"), async ctx => {
            const data = ctx.callbackQuery.data;
            const msgId = ctx.callbackQuery.message?.message_id;
            const callbackData = JSON.parse(data);
            const taskId = callbackData.taskId;
            const option = callbackData.replyOption;
            let message;
            const task = await this.DB.fetchTaskById(taskId);
            const userName = task.userName;
            switch (option) {
                case tgUserReplyOption.confirm:
                    console.log(`${userName} recieved his task.`);
                    message = this.composer.replyDallas(task);
                    await this.mailman.sendToTg(message, msgId);
                    await this.DB.setPendingTaskStatus(taskId);
                    break;
                case tgUserReplyOption.snooze:
                    console.log(`${userName} snoozed his task.`);
                    message = this.composer.replyRipley(task);
                    await this.mailman.sendToTg(message, msgId);
                    await this.DB.setSnoozedTaskStatus(taskId);
                    break;
                case tgUserReplyOption.snoozeGalley:
                    console.log(`${userName} snoozed his task in Galley.`);
                    message = this.composer.replyRipley(task);
                    await this.mailman.sendToTg(message, msgId);
                    await this.DB.setSnoozedTaskStatus(taskId);
                    break;
                case tgUserReplyOption.done:
                    console.log(`${userName} has done his job.`);
                    message = this.composer.replyKane(task);
                    await this.mailman.sendToTg(message, msgId);
                    await this.DB.setDoneTaskStatus(taskId);
                    await ctx.telegram.sendPoll(
                        process.env.CHAT_ID as string,
                        `How do you assess ${userName}'s watch duty in the ${task.area}`,
                        ["🦍", "🍄", "💩"]
                    );
                    break;
                case tgUserReplyOption.help:
                    console.log(`${userName} called for a help in the Galley.`);
                    message = this.composer.replyRipley(
                        task,
                        tgUserReplyOption.help
                    );
                    await this.mailman.sendToTg(message, msgId);
                    message = this.composer.talkNostromo(
                        nostromoChatOpt.helpGalley
                    );
                    await this.mailman.sendToTg(message, msgId);
                    break;
            }
        });
    }
    // testListener() {
    //     this.bot.on(callbackQuery("data"), async ctx => {
    //         const data = ctx.callbackQuery.data;
    //         let targetMsg
    //         const msgId = ctx.callbackQuery.message?.message_id;
    //         // if (msgId) {
    //         //     targetMsg = msgId - 1;
    //         // }
    //         const callbackData = JSON.parse(data);
    //         const taskId = callbackData.taskId;
    //         const option = callbackData.replyOption;
    //         let message;
    //         const task = await this.DB.fetchTaskById(taskId);
    //         const userName = task.userName;
    //         switch (option) {
    //             case tgUserReplyOption.confirm:
    //                 console.log(`${userName} recieved his task.`);
    //                 await ctx.deleteMessage(msgId);
    //                 message = this.composer.replyDallas(task);
    //                 await this.mailman.sendToTg(message);
    //                 break;
    //             case tgUserReplyOption.snooze:
    //                 console.log(`${userName} snoozed his task.`);
    //                 message = this.composer.replyRipley(task);
    //                 await this.mailman.sendToTg(message);
    //                 break;
    //             case tgUserReplyOption.done:
    //                 console.log(`${userName} has done his job.`);
    //                 message = this.composer.replyKane(task);
    //                 await this.mailman.sendToTg(message);
    //                 await ctx.telegram.sendPoll(
    //                     process.env.OUR_CHAT as string,
    //                     `How do you assess ${userName}'s watch duty in the ${task.area}`,
    //                     ["🦍", "🍄", "💩"]
    //                 );
    //                 break;
    //             case tgUserReplyOption.help:
    //                 console.log(`${userName} called for a help in the Galley.`);
    //                 message = this.composer.replyRipley(
    //                     task,
    //                     tgUserReplyOption.help
    //                 );
    //                 await this.mailman.sendToTg(message);
    //                 message = this.composer.talkNostromo(
    //                     nostromoChatOpt.helpGalley
    //                 );
    //                 await this.mailman.sendToTg(message);
    //                 break;
    //         }
    //     });
    // }

    // async testCheck() {
    //     console.log("For whom the test bell tolls.");
    //     const newTasks = await this.DB.fetchNewTasks();
    //     const chatMessage = this.composer.talkNostromo(
    //         nostromoChatOpt.schedule,
    //         newTasks
    //     );
    //     await this.mailman.sendToTg(chatMessage);
    //     for (const task of newTasks) {
    //         const dallasMessage = this.composer.talkDallas(task);
    //         await this.mailman.sendToTg(dallasMessage);
    // const ripleyMessage = this.composer.talkRipley(task);
    // await this.mailman.sendToTg(ripleyMessage);
    // const kaneMessage = this.composer.talkKane(task);
    // await this.mailman.sendToTg(kaneMessage);
    //     }
    // }
}
