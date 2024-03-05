import { ICalendar } from "../interfaces/interfaces";

export const getCalendarData = async (): Promise<ICalendar | null> => {
    if (!process.env.CALEND) {
        console.error("Missing required environmental variables for Calendar");
        return null;
    }
    let apiCall = await fetch(process.env.CALEND as string);
    let apiResponse = await apiCall.json();
    // retry if error
    return apiResponse as ICalendar;
};
