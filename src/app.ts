import "dotenv/config";
import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { cleaningScheduler } from "./schedulers/cleaning.scheduler";
import { getCalendarData, findTasks } from "./utils/utils";
import * as cron from "node-cron";

export const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.BOT_TOKEN as string
);

bot.use(Telegraf.log());
// bot.use(session()); // add sessions

bot.start(ctx => {
    ctx.reply("Hello " + ctx.from.first_name + "!");
});
bot.help(ctx => {
    ctx.reply("Send /start to receive a greeting");
    ctx.reply("Send /keyboard to receive a message with a keyboard");
    // ctx.reply("Send /quit to stop the bot");
    ctx.reply("Send /date to see where are you in time");
});
bot.command("date", ctx => {
    let today = new Date();
    let toDate = today.toISOString().split("T")[0];
    ctx.reply("Today is " + toDate);
});

// const job = cleaningScheduler(getCalendarData, findTasks);

cron.schedule("0 0 12 * * 1", async () => {
    console.log("For whom the Moday bell tolls.");
    const calendar = await getCalendarData();
    findTasks(calendar);
});
cron.schedule("0 50 20 * * 1", async () => {
    console.log("For whom the Moday bell tolls.");
    const calendar = await getCalendarData();
    findTasks(calendar);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const bootstrap = () => {
    bot.launch();
    console.log("Roommie online");
};

bootstrap();
