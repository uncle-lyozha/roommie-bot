import { ICalendar } from "../interfaces/interfaces";
import { ICalendarService } from "./calendar.interface";

export class CalendarService implements ICalendarService {
    constructor() {}

    async getCalendarData (): Promise<ICalendar>{
        if (!process.env.CALEND) {
            console.error("Missing required environmental variables for Calendar");
        }
        let apiCall = await fetch(process.env.CALEND as string);
        let apiResponse = await apiCall.json();
        // retry if error
        return apiResponse as ICalendar;
    };
}