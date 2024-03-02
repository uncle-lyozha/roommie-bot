import {
    IEvent,
    ISnooze,
    IWeek,
    calendar,
    event,
    user,
} from "../interfaces/interfaces";
import mongoose, { ObjectId } from "mongoose";
import { WeekSchema } from "../schemas/week.schema";
import { UserSchema } from "../schemas/user.schema";
import { getCalendarData } from "./calendar.service";
import { SnoozeSchema } from "../schemas/snooze.schema";

export const Week = mongoose.model("Week", WeekSchema);
export const User = mongoose.model("User", UserSchema);
export const Snooze = mongoose.model("Snooze", SnoozeSchema);

export const saveNewWeekToDb = async (): Promise<void | null> => {
    const calendar = await getCalendarData();
    if (!calendar) {
        console.error("Calendar data is missing.");
        return null; // add retry
    }
    const today = new Date();
    const toDate = today.toISOString().split("T")[0];
    // const toDate = "2024-02-26"; // test config
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
            let description = event.description as string;

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
        console.error("Error while saving to db.", err);
    }
};

export const findCurrentWeek = async () => {
    const result = await Week.findOne({
        isCurrent: true,
    }).populate("events.userId");
    return result;
};

export const updateCurrentWeek = async () => {
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
        console.error("Error updating Week document:", err);
    }
};

export const addNewSnooze = async (
    TGId: number,
    userName: string,
    area: string,
    description: string
) => {
    const newSnooze = new Snooze({
        TGId: TGId,
        userName: userName,
        area: area,
        description: description,
    });
    try {
        await newSnooze.save();
        console.log("New Snooze added to db.");
    } catch (err) {
        console.error("Error while saving Snooze to db.", err);
    }
};

export const getSnoozers = async () => {
    try {
        const allSnoozes: ISnooze[] = await Snooze.find({});
        return allSnoozes;
    } catch (err) {
        console.error("Error getting Snoozers: ", err);
    }
};

export const deleteSnooze = async (id: ObjectId) => {
    try {
        await Snooze.findByIdAndDelete(id);
        console.log("Document deleted successfully: ", id);
    } catch (error) {
        console.error("Error deleting Snooze document: ", error);
    }
};
