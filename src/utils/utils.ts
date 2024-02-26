import { calendar, event } from "../interfaces/interfaces";
import { bot } from "../app";
import { Markup, Context } from "telegraf";

const TEST_CHAT = -4065145869;
const OUR_CHAT = -4046451983;
const SAU = 227988482;
const CHIRILL = 8968145;
const PAKHAN = 414171939;
const VIT = 111471;
const LYOZHA = 268482275;

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

export const findTasks = (calendar: calendar | null): void | null => {
    if (!calendar) {
        console.error("Calendar data is missing.");
        return null;
    }
    let targetEvents: event[] = [];
    const today = new Date();
    const toDate = today.toISOString().split("T")[0];
    const events = calendar.items;
    events.forEach(event => {
        if (toDate === event.start.date) {
            targetEvents.push(event);
        }
    });
    messanger(targetEvents);
};

const messanger = (events: event[]): void => {
    let chatMessage: string = "THIS WEEK ON DUTY:\n";
    events.forEach(item => {
        chatMessage += item.summary + "\n";
        let user = item.summary.split(" ")[1];
        let area = item.summary.split(" ")[0];
        if (user === "LYOZHA") {
            userMessage(LYOZHA, area);
        }
        if (user === "PAKHAN") {
            userMessage(PAKHAN, area);
        }
        if (user === "CHIRILL") {
            userMessage(CHIRILL, area);
        }
        if (user === "VIT") {
            userMessage(VIT, area);
        }
    });
    bot.telegram.sendMessage(OUR_CHAT, chatMessage);
};

const userMessage = (user: number, area: string): void => {
    const keyboard = Markup.inlineKeyboard([
        Markup.button.callback("Gotcha 👍", "first"),
    ]);
    bot.telegram.sendMessage(
        user,
        `This week you are responsible for cleaning ${area}!`,
        { reply_markup: keyboard as any }
    );
};
