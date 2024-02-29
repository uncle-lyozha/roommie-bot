import { calendar } from "../interfaces/interfaces";
import { saveNewWeekToDb, updateCurrentWeek } from "./db";
import { NotificationCenter } from "./notification-center";

export const getCalendarData = async (): Promise<calendar | null> => {
    try {
        if (!process.env.CALEND_ID || !process.env.CALEND_TOKEN) {
            console.error(
                "Missing required environmental variables for Calendar"
            );
            return null;
        }
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
        return apiResponse as calendar;
    } catch (error) {
        console.error("Error fetching calendar data", error);
        return null;
    }
};

export const test = async () => {
    console.log("Test running");
    const notifications = new NotificationCenter();
    console.log("For whom the Moday bell tolls.");
    await updateCurrentWeek();
    await saveNewWeekToDb();
    // notifications.chatNotification();    
    // notifications.sendNotifications(1);
    // updateCurrentWeek();
    // const calendar = await getCalendarData();
    // notifications.sendNotifications(4);
    // testSchedule.start();
    // checkSnoozers();
};