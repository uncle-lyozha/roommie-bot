import * as cron from "node-cron";
import { IComposer } from "../composer/composer.interface";
import { IDBService } from "../db/db.interface";
import { IScheduler } from "./scheduler.interface";
import { IMailman } from "../mailman/mailman.interface";
import { DBService } from "../db/db.service";
import { CalendarService } from "../calendar/calendar.service";
import { ComposerService } from "../composer/composer.service";
import { MailmanService } from "../mailman/mailman.service";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { tgUserReplyOption } from "../utils/constants";

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
            await this.DB.updateTaskStatuses();
            await this.DB.populateTasks();
            const chatMessage = await this.composer.composeTGChatMessage();
            await this.mailman.sendToTG(chatMessage);
            const newTasks = await this.DB.fetchNewTasks();
            for (const task of newTasks) {
                const privateMessage =
                    await this.composer.composeTGPrivateMessage(task);
                await this.mailman.sendToTG(privateMessage);
            }
        });
    }

    async repeating() {
        cron.schedule("0 11 * * 4-6", async () => {
            console.log("For whom the repeating bell tolls.");

            // const chatMessage = await this.composer.composeTGChatMessage();
            // await this.mailman.sendToTG(chatMessage.ID, chatMessage.text, chatMessage.markup);
        });
    }

    async testCheck() {
        cron.schedule("* * * * *", async () => {
            console.log("For whom the Monday bell tolls.");
            // const chatMessage = await this.composer.composeTGChatMessage();
            // await this.mailman.sendToTG(chatMessage);

            const newTasks = await this.DB.fetchNewTasks();
            for (const task of newTasks) {
                const privateMessage =
                    await this.composer.composeTGPrivateMessage(task);
                await this.mailman.sendToTG(privateMessage);
            }
        });
    }

    listener() {
        this.bot.action(tgUserReplyOption.confirm, async (ctx: Context) => {
            const userName = ctx.from?.username;
            const messageText = ctx.text;
            if (messageText) {
                const area = messageText.split(" ")[0];
                console.log(area);
                await this.DB.setPendingTaskStatus(area);
            }
            console.log(`${userName} recieved his task.`);
            await ctx.editMessageText("Cool!");
        });
        this.bot.action(tgUserReplyOption.done, async (ctx: Context) => {
            const userName = ctx.from?.username;
            const messageText = ctx.text;
            if (messageText) {
                const area = messageText.split(" ")[0];
                await this.DB.setDoneTaskStatus(area);
            }
            console.log(`${userName} has done his job.`);
            await ctx.editMessageText("You're the best ... around! 🏆");
        });
        this.bot.action(tgUserReplyOption.snooze, async (ctx: Context) => {
            const userName = ctx.from?.username;
            const messageText = ctx.text;
            if (messageText) {
                const area = messageText.split(" ")[0];
                await this.DB.setSnoozedTaskStatus(area);
            }
            console.log(`User snoozed his task.`);
            await ctx.editMessageText("Ok, I'll remind you tomorrow.");
        });
    }
}
