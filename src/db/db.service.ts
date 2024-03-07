import mongoose, { ObjectId } from "mongoose";
import { WeekSchema } from "../schemas/week.schema";
import { UserSchema } from "../schemas/user.schema";
import { SnoozeSchema } from "../schemas/snooze.schema";
import { getCalendarData } from "../utils/calendar.service";
import { ISnooze, IWeek } from "../interfaces/interfaces";
import { IDBService } from "./db.interface";

export class DBService implements IDBService {
    constructor() {}
    private Week = mongoose.model("Week", WeekSchema);
    private User = mongoose.model("User", UserSchema);
    private Snooze = mongoose.model("Snooze", SnoozeSchema);

    async saveNewWeekToDb(): Promise<void> {
        const calendar = await getCalendarData();
        if (!calendar) {
            console.error("Calendar data is missing.");
            throw new Error("Can not retrieve calendar data");
            // add retry
        }
        const today = new Date();
        // const toDate = today.toISOString().split("T")[0];
        const toDate = "2024-03-04"; // test config
        const events = calendar.items;
        const newWeek = new this.Week({
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
                this.populateEvents(newWeek, userName, area, description);
            }
        }
        newWeek.summary = summary;
        await newWeek.save();
        console.log("New week added to db.");
    }

    private async populateEvents(
        newWeek: IWeek,
        userName: string,
        area: string,
        description: string
    ): Promise<void> {
        let user = await this.User.findOne({ name: userName });
        if (user) {
            newWeek.events.push({
                userId: user._id,
                area: area,
                description: description,
            });
        } else {
            console.warn(`User not found in the db.`);
        }
    }

    async findCurrentWeek(): Promise<IWeek> {
        const result = await this.Week.findOne({
            isCurrent: true,
        }).populate("events.userId");
        if (result) {
            return result;
        } else {
            throw new Error(
                "There is no weeks in db with current value set to true."
            );
        }
    }

    async updateCurrentWeek(): Promise<void> {
        await this.Week.updateOne(
            { isCurrent: true },
            { $set: { isCurrent: false } }
        );
    }

    async getSnoozers(): Promise<ISnooze[]> {
        const allSnoozes = await this.Snooze.find({});
        return allSnoozes;
    }

    async addNewSnooze(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ): Promise<void> {
        const newSnooze = new this.Snooze({
            TGId: TGId,
            userName: userName,
            area: area,
            description: description,
        });
        await newSnooze.save();
        console.log("New Snooze added to db.");
    }

    async deleteSnooze(id: ObjectId): Promise<void> {
        await this.Snooze.findByIdAndDelete(id);
        console.log("Snooze deleted successfully: ", id);
    }
}
