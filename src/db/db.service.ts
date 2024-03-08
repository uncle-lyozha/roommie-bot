import mongoose, { ObjectId, Schema } from "mongoose";
import { UserSchema } from "../schemas/user.schema";
import { getCalendarData } from "../utils/calendar.service";
import {
    ICalendar,
    ICalendarEvent,
    IEvent,
    ISnooze,
    IUser,
    IWeek,
} from "../interfaces/interfaces";
import { IDBService } from "./db.interface";
import { TaskSchema } from "../schemas/task.schema";
import { taskStatus } from "../utils/constants";

export class DBService implements IDBService {
    constructor() {}

    private Task = mongoose.model("Task", TaskSchema);
    private User = mongoose.model("User", UserSchema);

    async populateTasks(): Promise<void> {
        const calendar = await getCalendarData();
        if (!calendar) {
            console.error("Calendar data is missing.");
            throw new Error("Can not retrieve calendar data");
            // add retry
        }
        const date = new Date().toISOString();
        // const dateToCheck = date.split("T")[0];
        const dateToCheck = "2024-03-04"; // test config
        const events = calendar.items;
        let summary: string = "";
        for (const event of events) {
            if (dateToCheck === event.start.date) {
                summary += event.summary + "\n";
                let userName = event.summary.split(" ")[1];
                let TGId = await this.findUser(userName);
                let area = event.summary.split(" ")[0];
                let description = event.description as string;
                let status = taskStatus.new;
                // let date = new Date().toISOString;
                let newTask = new this.Task({
                    userName: userName,
                    TGId: TGId,
                    area: area,
                    description: description,
                    status: status,
                    date: date,
                });
                await newTask.save();
                console.log("New task added to db.");
            }
        }
    }

    private async findUser(userName: string): Promise<number> {
        let user: IUser | null = await this.User.findOne({ name: userName });
        if (user) {
            const userId = user.TG.tgId;
            return userId;
        } else {
            throw new Error(`User ${userName} not found in DB.`);
        }
    }
}
