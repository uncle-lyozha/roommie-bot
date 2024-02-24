import * as schedule from "node-schedule";
import { calendar, event } from "../interfaces/interfaces";

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 3)];
rule.hour = 12;
rule.minute = 0;
rule.tz = "CET";

export const cleaningScheduler = (
    getCalendarData: () => Promise<calendar | null>,
    findTasks: (calendar: calendar | null) => void
): schedule.Job => {
    const job = schedule.scheduleJob(rule, async () => {
        const calendar = await getCalendarData();
        findTasks(calendar);
    });
    return job;
};
