import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import mongoose from "mongoose";
import {
    mondayCheck,
    snoozeCheck,
    sundayCheck,
    thursdayCheck,
} from "./utils/schedulers";
import { test } from "./test/test";
import { DBService } from "./db/db.service";
import { CalendarService } from "./calendar/calendar.service";
import { MailmanService } from "./mailman/mailman.service";
import { ComposerService } from "./composer/composer.service";
import { SchedulerService } from "./scheduler/scheduler.service";

export const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.TEST_BOT as string
);

const Calendar = new CalendarService();
const Mailman = new MailmanService(bot);
const DB = new DBService(Calendar);
const Composer = new ComposerService(DB, Mailman);
const Scheduler = new SchedulerService(Composer, DB);

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

// test();

Scheduler.monday()
