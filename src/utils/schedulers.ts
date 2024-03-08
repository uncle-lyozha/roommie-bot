import * as cron from "node-cron";
import { NotificationCenter } from "../mailman/notification.service";
import { DBService } from "../db/db.service";

export enum NotificationOption {
    monday = 1,
    snooze = 4,
    sunday = 7,
}

const notifications = new NotificationCenter();
const db = new DBService();

export const mondayCheck = cron.schedule("0 11 * * 1", async () => {
    console.log("For whom the Moday bell tolls.");
    await db.populateTasks();
    // const currentWeek = await db.findCurrentWeek();
    // await notifications.sendChatNotification(currentWeek);
    // await notifications.sendNotifications(
    //     currentWeek,
    //     NotificationOption.monday
    // );
});

export const thursdayCheck = cron.schedule("0 11 * * 4", async () => {
    console.log("Thursday bell tolls.");
    // const currentWeek = await db.findCurrentWeek();
    // await notifications.sendNotifications(
    //     currentWeek,
    //     NotificationOption.snooze
    // );
});

// export const saveNewSnooze = async (
//     TGId: number,
//     userName: string,
//     area: string,
//     description: string
// ) => {
//     await db.addNewSnooze(TGId, userName, area, description);
// };

export const snoozeCheck = cron.schedule("0 12 * * 5-6", async () => {
    console.log("For snoozers bell tolls.");
    // const result = await db.getSnoozers();
    // if (result) {
    //     for (const item of result) {
    //         const TGId = item.TGId;
    //         const userName = item.userName;
    //         const area = item.area;
    //         const description = item.description;
    //         await notifications.sendReminder(TGId, userName, area, description);
    //         await db.deleteSnooze(item._id);
    //     }
    // }
});

export const sundayCheck = cron.schedule("0 12 * * 7", async () => {
    console.log("Final bell tolls.");
    // const result = await db.getSnoozers();
    // if (result) {
    //     for (const item of result) {
    //         const TGId = item.TGId;
    //         const userName = item.userName;
    //         const area = item.area;
    //         const description = item.description;
    //         await notifications.sendSundayReminder(
    //             TGId,
    //             userName,
    //             area,
    //             description
    //         );
    //         await db.deleteSnooze(item._id);
    //     }
    // }
});

export const testCheck = cron.schedule("* * * * *", async () => {
    console.log("Scheduler fires.");
    
    db.populateTasks();
    // const result = await db.getSnoozers();
    // if (result) {
    //     for (const item of result) {
    //         const TGId = item.TGId;
    //         const userName = item.userName;
    //         const area = item.area;
    //         const description = item.description;
    //         await notifications.sendSundayReminder(
    //             TGId,
    //             userName,
    //             area,
    //             description
    //         );
    //         await db.deleteSnooze(item._id);
    //     }
    // }
});
