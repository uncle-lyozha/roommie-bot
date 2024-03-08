import { ICalendar } from "../interfaces/interfaces";

export interface ICalendarService {
    getCalendarData(): Promise<ICalendar>;
}