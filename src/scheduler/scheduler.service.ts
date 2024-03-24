import * as cron from "node-cron";
import { IScheduler } from "./scheduler.interface";
import { IMailman } from "../mailman/mailman.interface";
import { DBService } from "../db/db.service";
import { CalendarService } from "../calendar/calendar.service";
import { ComposerService } from "../composer/composer.service";
import { MailmanService } from "../mailman/mailman.service";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { callbackQuery } from "telegraf/filters";
import { tgUserReplyOption } from "../utils/constants";
import { MessageType, TaskType } from "../utils/types";
import { error } from "console";
import { msgImage } from "../utils/images";

export class SchedulerService implements IScheduler {
    private readonly bot: Telegraf<Context<Update>>;
    private readonly calendar = new CalendarService();
    private readonly DB = new DBService(this.calendar);
    private readonly composer = new ComposerService(this.DB);
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
            const chatMessage = await this.composer.composeTGChatMessage();
            await this.mailman.sendPictureToTG(chatMessage);
            const newTasks = await this.DB.fetchNewTasks();
            for (const task of newTasks) {
                const privateMessage = await this.composer.composeTGInitialPM(
                    task
                );
                await this.mailman.sendPictureToTG(privateMessage);
                await this.mailman.sendKeyboardToTG(privateMessage);
            }
        });
    }

    async repeating() {
        cron.schedule("0 11 * * 4-6", async () => {
            console.log("For whom the repeating bell tolls.");
            const tasks = await this.DB.fetchPendingTasks();
            for (const task of tasks) {
                const privateMessage = await this.composer.composeTGRepeatingPM(
                    task
                );
                await this.mailman.sendPictureToTG(privateMessage);
                await this.mailman.sendKeyboardToTG(privateMessage);
            }
        });
    }

    async sunday() {
        cron.schedule("0 11 * * 7", async () => {
            console.log("For whom the sunday bell tolls.");
            const tasks = await this.DB.fetchPendingTasks();
            for (const task of tasks) {
                const privateMessage = await this.composer.composeTGFinalPM(
                    task
                );
                await this.mailman.sendPictureToTG(privateMessage);
                await this.mailman.sendKeyboardToTG(privateMessage);
            }
        });
    }

    listener() {
        this.bot.on(callbackQuery("data"), async ctx => {
            const data = ctx.callbackQuery.data;
            const callbackData = JSON.parse(data);
            const taskId = callbackData.taskId;
            const option = callbackData.replyOption;
            let message;
            const task = await this.DB.fetchTaskById(taskId);
            const userName = task.userName;
            switch (option) {
                case tgUserReplyOption.confirm:
                    console.log(`${userName} recieved his task.`);
                    message = await this.composer.composeTGDallasPM(task);
                    await this.mailman.sendPictureToTG(message);
                    await this.DB.setPendingTaskStatus(taskId);
                    break;
                case tgUserReplyOption.snooze:
                    console.log(`${userName} snoozed his task.`);
                    message = await this.composer.composeTGRipleyPM(task);
                    await this.mailman.sendPictureToTG(message);
                    await this.DB.setSnoozedTaskStatus(taskId);
                    break;
                case tgUserReplyOption.done:
                    console.log(`${userName} has done his job.`);
                    message = await this.composer.composeTGKanePM(task);
                    await this.mailman.sendPictureToTG(message);
                    await this.DB.setDoneTaskStatus(taskId);
                    await ctx.telegram.sendPoll(
                        process.env.OUR_CHAT as string,
                        `How do you assess ${userName}'s watch duty in the ${task.area}`,
                        ["🦍", "🍄", "💩"]
                    );
                    break;
                case tgUserReplyOption.help:
                    console.log(`${userName} called for a help in the Galley.`);
                    message = await this.composer.composeTGRipleyHelpPM(task);
                    await this.mailman.sendPictureToTG(message);
                    message = await this.composer.composeTGChatHelp();
                    await this.mailman.sendPictureToTG(message);
                    break;
            }
        });

        //     this.bot.action(tgUserReplyOption.confirm, async (ctx: Context) => {
        //         const userName = ctx.from?.username;
        //         const messageText = ctx.text;
        //         let taskId: string;
        //         let objectives = "";
        //         if (messageText) {
        //             taskId = messageText.split(":")[0];
        //             await this.DB.setPendingTaskStatus(taskId);
        //             const task = await this.DB.fetchTaskById(taskId);
        //             objectives = task.description;
        //         }
        //         console.log(`${userName} recieved his task.`);
        //         await ctx.editMessageText(
        //             `Cpt Dallas:\n Good. Officer Ripley will check up on you on Thursday. \nYour objectives are: \n${objectives}`
        //         );
        //     });
        //     this.bot.action(tgUserReplyOption.done, async (ctx: Context) => {
        //         const userName = ctx.from?.username;
        //         const messageText = ctx.text;
        //         console.log(`${userName} has done his job.`);
        //         let taskId: string;
        //         let task: TaskType;
        //         if (messageText) {
        //             taskId = messageText.trim().split(":")[0];
        //             await this.DB.setDoneTaskStatus(taskId);
        //         } else {
        //             throw new Error("TaskId is not found");
        //         }
        //         task = await this.DB.fetchTaskById(taskId);
        //         await ctx.editMessageText(
        //             "Kane:\n Great! Now we're ready to investigate that distress signal the Mother woke up us for."
        //         );
        //         await ctx.telegram.sendPoll(
        //             process.env.OUR_CHAT as string,
        //             `How do you assess ${userName}'s watch duty in the ${task.area}`,
        //             ["🦍", "🍄", "💩"]
        //         );
        //     });
        //     this.bot.action(tgUserReplyOption.snooze, async (ctx: Context) => {
        //         const userName = ctx.from?.username;
        //         const messageText = ctx.text;
        //         console.log(`${userName} snoozed his task.`);
        //         let taskId: string;
        //         if (messageText) {
        //             taskId = messageText.split(":")[0];
        //             await this.DB.setSnoozedTaskStatus(taskId);
        //         }
        //         await ctx.editMessageText(
        //             "Ripley:\n Ok, hang on. I'll check up on you later."
        //         );
        //     });
        //     this.bot.action(tgUserReplyOption.help, async (ctx: Context) => {
        //         const userName = ctx.from?.username;
        //         const messageText = ctx.text;
        //         console.log(`${userName} called for a help in the Galley.`);
        //         let taskId: string;
        //         if (messageText) {
        //             taskId = messageText.split(":")[0];
        //             await this.DB.setSnoozedTaskStatus(taskId);
        //             const chatMessage: MessageType = {
        //                 // ID: Number(process.env.TEST_ID),
        //                 ID: Number(process.env.OUR_CHAT),
        //                 imgCap: {
        //                     caption:
        //                         "**USCSS Nostromo alarm and notification system.** \n Attention Crew: Whatchman in the Galley requested for an assistance. Please be responsive to your crewmate.",
        //                 },
        //                 imgUrl: msgImage.nostromo,
        //             };
        //             await this.mailman.sendPictureToTG(chatMessage);
        //         }
        //         await ctx.editMessageText(
        //             "Ripley:\n Understood. I'll give a call to the crew and send somebody in."
        //         );
        //     });
        // }
    }

    // async testCheck() {
    // cron.schedule("* * * * *", async () => {
    // console.log("Test bell tolls.");
    // monday test
    // await this.DB.deleteAllTasks();
    // await this.DB.setFailedTaskStatuses();
    // await this.DB.populateTasks();
    // const chatMessage = await this.composer.composeTGChatMessage();
    // await this.mailman.sendToTG(chatMessage);
    // const newTasks = await this.DB.fetchNewTasks();
    // for (const task of newTasks) {
    //     const privateMessage =
    //         await this.composer.composeTGInitialPM(task);
    //     await this.mailman.sendToTG(privateMessage);
    // }

    // repeating test
    // const tasks = await this.DB.fetchPendingTasks();
    // for (const task of tasks) {
    //     let privateMessage: MessageType;
    //     privateMessage = await this.composer.composeTGFinalPM(task);
    //     let privateMessage1 = await this.composer.composeTGRepeatingPM(
    //         task
    //     );
    //     await this.mailman.sendToTG(privateMessage);
    //     await this.mailman.sendToTG(privateMessage1);
    // }
    // });
}
