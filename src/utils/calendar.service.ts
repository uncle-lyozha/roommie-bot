import { calendar } from "../interfaces/interfaces";
import { saveNewWeekToDb, updateCurrentWeek } from "./db";
import { NotificationCenter } from "../mailman/notification.service";

export const getCalendarData = async (): Promise<calendar | null> => {
    if (!process.env.CALEND) {
        console.error("Missing required environmental variables for Calendar");
        return null;
    }
    let apiCall = await fetch(process.env.CALEND as string);
    let apiResponse = await apiCall.json();
    // retry if error
    return apiResponse as calendar;
};
