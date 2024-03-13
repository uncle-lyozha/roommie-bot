import { CalendarType } from "../utils/types";

export interface ICalendarService {
    getCalendarData(): Promise<CalendarType>;
}
