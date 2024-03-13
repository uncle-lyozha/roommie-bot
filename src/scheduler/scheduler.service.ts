import * as cron from "node-cron";
import { IScheduler } from "./scheduler.interface";
import { IMailman } from "../mailman/mailman.interface";
import { DBService } from "../db/db.service";
import { CalendarService } from "../calendar/calendar.service";
import { ComposerService } from "../composer/composer.service";
import { MailmanService } from "../mailman/mailman.service";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { tgUserReplyOption } from "../utils/constants";
import { MessageType } from "../utils/types";

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
        cron.schedule("35 12 * * 3", async () => {
            console.log("For whom the Monday bell tolls.");
            await this.DB.setFailedTaskStatuses();
            await this.DB.populateTasks();
            const chatMessage = await this.composer.composeTGChatMessage();
            await this.mailman.sendToTG(chatMessage);
            const newTasks = await this.DB.fetchNewTasks();
            for (const task of newTasks) {
                const privateMessage = await this.composer.composeTGInitialPM(
                    task
                );
                await this.mailman.sendToTG(privateMessage);
            }
        });
    }

    async repeating() {
        cron.schedule("0 11 * * 4-7", async () => {
            console.log("For whom the repeating bell tolls.");
            const tasks = await this.DB.fetchPendingTasks();
            for (const task of tasks) {
                let privateMessage: MessageType;
                if (task.snoozedTimes > 2) {
                    privateMessage = await this.composer.composeTGFinalPM(task);
                } else {
                    privateMessage = await this.composer.composeTGRepeatingPM(
                        task
                    );
                }
                await this.mailman.sendToTG(privateMessage);
            }
        });
    }

    async testCheck() {
        cron.schedule("* * * * *", async () => {
            console.log("Test bell tolls.");
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
            //     if (task.snoozedTimes > 2) {
            //         privateMessage = await this.composer.composeTGFinalPM(task);
            //     } else {
            //         privateMessage = await this.composer.composeTGRepeatingPM(
            //             task
            //         );
            //     }
            //     await this.mailman.sendToTG(privateMessage);
            // }
        });
    }

    listener() {
        this.bot.action(tgUserReplyOption.confirm, async (ctx: Context) => {
            const userName = ctx.from?.username;
            const messageText = ctx.text;
            let taskId: string;
            let objectives = "";
            if (messageText) {
                taskId = messageText.split(":")[0];
                await this.DB.setPendingTaskStatus(taskId);
                const task = await this.DB.fetchTaskById(taskId);
                objectives = task.description;
            }
            console.log(`${userName} recieved his task.`);
            await ctx.editMessageText(
                `Good. Officer Ripley will check up on you on Thursday. \nYour objectives are: \n${objectives}`
            );
        });
        this.bot.action(tgUserReplyOption.done, async (ctx: Context) => {
            const userName = ctx.from?.username;
            const messageText = ctx.text;
            let taskId: string;
            if (messageText) {
                taskId = messageText.split(":")[0];
                await this.DB.setDoneTaskStatus(taskId);
            }
            console.log(`${userName} has done his job.`);
            await ctx.editMessageText(
                "Great! Now we're ready to takeoff. Good job, let's have some beer."
            );
        });
        this.bot.action(tgUserReplyOption.snooze, async (ctx: Context) => {
            const userName = ctx.from?.username;
            const messageText = ctx.text;
            let taskId: string;
            if (messageText) {
                taskId = messageText.split(":")[0];
                await this.DB.setSnoozedTaskStatus(taskId);
            }
            console.log(`${userName} snoozed his task.`);
            await ctx.editMessageText(
                "Ok, take your time. I'll check up on you later."
            );
        });
    }
}
