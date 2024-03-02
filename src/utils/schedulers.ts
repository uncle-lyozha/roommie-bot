import * as cron from "node-cron";
import { NotificationCenter } from "./notification-center";
import {
    checkSnoozers,
    deleteSnooze,
    saveNewWeekToDb,
    updateCurrentWeek,
} from "./db";

const notifications = new NotificationCenter();

export const mondayCheck = cron.schedule("0 0 12 * * 1", async () => {
    console.log("For whom the Moday bell tolls.");
    await updateCurrentWeek();
    await saveNewWeekToDb();
    notifications.chatNotification();    
    notifications.sendNotifications(1);
});

export const thursdayCheck = cron.schedule("0 0 12 * * 4", async () => {
    console.log("Thursday bell tolls.");
    notifications.sendNotifications(1);
});

export const snoozeCheck = cron.schedule("0 0 12 * * 5-6", async () => {
    console.log("For snoozers bell tolls.");
    const result = await checkSnoozers();
    if (result) {
        for (const item of result) {
            const TGId = item.TGId;
            const userName = item.userName;
            const area = item.area;
            const description = item.description;
            notifications.sendReminder(TGId, userName, area, description);
        }
    }
});

export const sundayCheck = cron.schedule("0 0 12 * * 7", async () => {
    console.log("Final bell tolls.");
    notifications.sendNotifications(7);
});
