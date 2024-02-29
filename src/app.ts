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
import { test } from "./utils/utils";

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

// test();

thursdayCheck.start();
snoozeCheck.start();
sundayCheck.start();

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
