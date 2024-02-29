import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import mongoose from "mongoose";
import {
    snoozeCheck,
    sundayCheck,
    testSchedule,
    thursdayCheck,
} from "./utils/schedulers";
import { NotificationCenter } from "./utils/notification-center";
import { saveNewWeekToDb, updateCurrentWeek } from "./utils/db";

export const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.BOT_TOKEN as string
);

bot.use(Telegraf.log());

// add menu
bot.start(ctx => {
    ctx.reply("Hello " + ctx.from.first_name + "!");
});
bot.help(ctx => {
    ctx.reply("Send /start to receive a greeting");
    // ctx.reply("Send /quit to stop the bot");
    ctx.reply("Send /date to see where are you in time");
});

const test = async () => {
    console.log("Test running");
    const notifications = new NotificationCenter();
    console.log("For whom the Moday bell tolls.");
    await updateCurrentWeek();
    await saveNewWeekToDb();
    notifications.chatNotification();    
    notifications.sendNotifications(1);
    // updateCurrentWeek();
    // const calendar = await getCalendarData();
    // notifications.sendNotifications(4);
    // testSchedule.start();
    // checkSnoozers();
};

// test();

// thursdayCheck.start();
// snoozeCheck.start();
// sundayCheck.start();

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
