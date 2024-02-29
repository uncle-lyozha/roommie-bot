import { calendar } from "../interfaces/interfaces";

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
