import "dotenv/config";
import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { cleaningScheduler } from "./schedulers/cleaning.scheduler";
import { getCalendarData, saveToDb, updateCurrentWeek } from "./utils/utils";
import * as cron from "node-cron";
import mongoose from "mongoose";
import { NotificationCenter } from "./utils/notification-center";

export const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.BOT_TOKEN as string
);

bot.use(Telegraf.log());
// bot.use(session()); // add sessions

const notifications = new NotificationCenter();

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

const test = async () => {
    console.log("Test running");
    // updateCurrentWeek();
    // const calendar = await getCalendarData();
    // await saveToDb(calendar);
    // notifications.mondayBell();
    notifications.bell(4);
};

test();

cron.schedule("0 0 12 * * 1", async () => {
    console.log("For whom the Moday bell tolls.");
    updateCurrentWeek();
    const calendar = await getCalendarData();
    await saveToDb(calendar);
    notifications.bell(1);
});

cron.schedule("0 0 12 * * 4", async () => {
    console.log("Thursday bell tolls.");
    notifications.bell(4);
})

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const bootstrap = async () => {
    try {
        if (!process.env.MDB_USER || !process.env.MDB_PASS) {
            console.error("DB credentials are not provided.");
        }
        bot.launch();
        await mongoose.connect(
            `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@roommie-cluster0.aoz01ma.mongodb.net/?retryWrites=true&w=majority&appName=Roommie-Cluster0`
        );
        console.log("Roommie is online");
    } catch (err) {
        console.error("DB connection error.");
    }
};

bootstrap();
