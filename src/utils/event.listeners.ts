import { Context } from "telegraf";

export const handleConfirm = async (ctx: Context) => {
    console.log(`User recieved the task.`);
    await ctx.sendMessage("Cool!");
}

export const handleDone = async (ctx: Context) => {
    console.log(`User has done his job.`);
    await ctx.editMessageText("You're the best ... around! 🏆");
}

export const handleSnooze = async (ctx: Context) => {
    console.log(`User snoozed his task.`);
    await ctx.editMessageText("Ok, I'll remind you tomorrow.");
    // await saveNewSnooze(TGId, userName, area, description);
}