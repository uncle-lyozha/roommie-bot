import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import "dotenv/config";
import { Range, RecurrenceRule, scheduleJob } from "node-schedule";

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
  ctx.editMessageText("Cool!");
});
bot.action("second", async ctx => {
  ctx.editMessageText("Booo you.");
});

const rule = new RecurrenceRule();
rule.dayOfWeek = [0, new Range(1, 5)];
rule.hour = 13;
rule.minute = 50;
rule.tz = "CET";

const job = scheduleJob(rule, ctx => {
  console.log("haha");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const bootstrap = () => {
  bot.launch();
  console.log("Roommie online");
};

bootstrap();
