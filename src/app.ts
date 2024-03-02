import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import mongoose from "mongoose";
import { mondayCheck, snoozeCheck, sundayCheck, thursdayCheck } from "./utils/schedulers";
import { test } from "./test/test";

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

test();

// mondayCheck.start()
// thursdayCheck.start();
// snoozeCheck.start();
// sundayCheck.start();

const bootstrap = async () => {
    if (!process.env.MONGO) {
        console.error("DB credentials are not provided.");
    }
    bot.launch();
    await mongoose.connect(process.env.MONGO as string);
    console.log("Roommie is online");
};

bootstrap();
