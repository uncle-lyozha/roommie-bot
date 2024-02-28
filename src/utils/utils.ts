import { calendar, event } from "../interfaces/interfaces";
import { bot } from "../app";
import { Markup, Context } from "telegraf";
import mongoose, { Schema } from "mongoose";
import { WeekSchema } from "../schemas/week.schema";
import { UserSchema } from "../schemas/user.schema";

const TEST_CHAT = -4065145869;

const SAU = 227988482; //saushkin_av
const CHIRILL = 8968145; //NewGuyNitro
const PAKHAN = 414171939; //bessonoffp
const VIT = 111471; //myshlaev
const LYOZHA = 268482275; //Lyozha

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

export const saveToDb = async (
    calendar: calendar | null
): Promise<void | null> => {
    if (!calendar) {
        console.error("Calendar data is missing.");
        return null;
    }
    const Week = mongoose.model("Week", WeekSchema);
    const User = mongoose.model("User", UserSchema);

    const today = new Date();

    // const toDate = today.toISOString().split("T")[0];
    let toDate = "2024-02-26"; //for test purposes
    const events = calendar.items;
    const newWeek = new Week({
        startDate: toDate,
        isCurrent: true,
    });
    let summary: string = "";
    for (const event of events) {
        if (toDate === event.start.date) {
            summary += event.summary + "\n";
            let userName = event.summary.split(" ")[1];
            let area = event.summary.split(" ")[0];
            let description = event.description;
            try {
                let user = await User.findOne({ name: userName });
                if (user) {
                    newWeek.events.push({
                        userId: user._id,
                        area: area,
                        description: description,
                    });
                } else {
                    console.warn(`User ${userName} not found in the db.`);
                }
            } catch (err) {
                console.error("Write to db error: ", err);
            }
        }
    }
    newWeek.summary = summary;
    try {
        await newWeek.save();
        console.log("New document added to db.");
    } catch (err) {
        console.log("Error while saving to db.");
    }
};

export const updateCurrentWeek = async () => {
    const Week = mongoose.model("Week", WeekSchema);
    try {
        const result = await Week.updateOne(
            { isCurrent: true },
            { $set: { isCurrent: false } }
        );
        if (result.matchedCount === 1) {
            console.log("isCurrent switched to fase!");
        } else if (result.matchedCount === 0) {
            console.warn("No documents found with isCurrent: true.");
        } else {
            console.error("Unexpected update result:", result);
        }
    } catch (err) {
        console.error("Error updating document:", err);
    }
};
