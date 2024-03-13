import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import mongoose from "mongoose";
import { SchedulerService } from "./scheduler/scheduler.service";

export const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.BOT_TOKEN as string
);

const Scheduler = new SchedulerService(bot);

bot.use(Telegraf.log());

const bootstrap = async () => {
    if (!process.env.MONGO) {
        console.error("DB credentials are not provided.");
    }
    bot.launch();
    await mongoose.connect(process.env.MONGO as string);
    console.log("Roommie is online");
};

bootstrap();

Scheduler.listener();
Scheduler.monday()
Scheduler.repeating()

// Scheduler.testCheck();