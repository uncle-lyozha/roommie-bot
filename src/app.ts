import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import "dotenv/config";
// import { Range, RecurrenceRule, scheduleJob } from "node-schedule";
import * as schedule from "node-schedule";

const LYOZHA = 268482275;
const TEST_CHAT = -4065145869;

const bot: Telegraf<Context<Update>> = new Telegraf(
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
    ctx.reply("Send /quit to stop the bot");
    ctx.reply("Send /date to see where are you in time");
});
bot.command("date", ctx => {
    let today = new Date();
    let toDate = today.toISOString().split("T")[0];
    ctx.reply("Today is " + toDate);
});
bot.command("quit", ctx => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id);
    // Context shortcut
    ctx.leaveChat();
});
bot.command("keyboard", ctx => {
    ctx.reply(
        "Keyboard",
        Markup.inlineKeyboard([
            Markup.button.callback("First option", "first"),
            Markup.button.callback("Second option", "second"),
        ])
    );
});
bot.action("first", async ctx => {
    ctx.editMessageText("Pook!");
});
bot.action("second", async ctx => {
    ctx.editMessageText("Kwak!");
});

async function getCalendarData() {
    try {
        const calendarId =
            (process.env.CALEND_ID as string) + "@group.calendar.google.com";
        const myKey = process.env.CALEND_TOKEN as string;
        let apiCall = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/" +
                calendarId +
                "/events?key=" +
                myKey
        );
        let apiResponse = await apiCall.json();
        return apiResponse;
    } catch (error) {
        console.log(error);
    }
}

type event = {
    start: {
        date: string;
    };
    summary: string;
};

interface calendar {
    items: [
        {
            start: {
                date: string;
            };
            summary: string;
        }
    ];
}

const findTasks = (calendar: calendar) => {
    let targetEvents: event[] = [];
    let chatMessage: string = "THIS WEEK ON DUTY:\n";
    const today = new Date();
    const toDate = today.toISOString().split("T")[0];
    const events = calendar.items;
    console.log(events[0].start.date);
    events.forEach(event => {
        if (toDate === event.start.date) {
            // if (event.summary === "Living room P") {
            console.log("zaebiz");
            targetEvents.push(event);
        }
    });
    targetEvents.forEach(item => {
        chatMessage += item.summary + "\n";
    });
    bot.telegram.sendMessage(TEST_CHAT, chatMessage);
    sendMessage();
};

const sendMessage = () => {};

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4)];
rule.hour = 23;
rule.minute = 10;
rule.tz = "CET";

const job = async () => {
    const calendar = (await getCalendarData()) as calendar;
    findTasks(calendar);
};

job();
// const job = schedule.scheduleJob(rule, async () => {
//     const calendar = (await getCalendarData()) as calendar;
//     findTasks(calendar);
// });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const bootstrap = () => {
    bot.launch();
    console.log("Roommie online");
};

bootstrap();
