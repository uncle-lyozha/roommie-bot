import * as schedule from "node-schedule";

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