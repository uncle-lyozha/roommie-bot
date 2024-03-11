import mongoose, { ObjectId, Schema } from "mongoose";
import { UserSchema } from "../schemas/user.schema";
import { IUser } from "../interfaces/interfaces";
import { IDBService } from "./db.interface";
import { TaskSchema } from "../schemas/task.schema";
import { taskStatus } from "../utils/constants";
import { ICalendarService } from "../calendar/calendar.interface";
import { TaskType } from "../utils/types";

export class DBService implements IDBService {
    private calendar: ICalendarService;

    constructor(calendar: ICalendarService) {
        this.calendar = calendar;
    }

    private Task = mongoose.model("Task", TaskSchema);
    private User = mongoose.model("User", UserSchema);

    async populateTasks(): Promise<void> {
        const calendar = await this.calendar.getCalendarData();
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
                let user = await this.findUserByName(userName);
                let TGId = user.TG.tgId;
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
                    snoozedTimes: 0,
                });
                await newTask.save();
                console.log("New task added to db.");
            }
        }
    }

    async updateTaskStatuses(): Promise<void> {
        await this.Task.updateMany({
            status: {
                $in: [taskStatus.new, taskStatus.snoozed, taskStatus.pending],
            },
            $set: { status: taskStatus.failed },
        });
    }

    async setPendingTaskStatus(area: string): Promise<void> {
        await this.Task.findOneAndUpdate(
            { area: area },
            { status: taskStatus.pending }
        );
    }
    async setDoneTaskStatus(area: string): Promise<void> {
        await this.Task.findOneAndUpdate(
            { area: area },
            { status: taskStatus.done }
        );
    }
    async setSnoozedTaskStatus(area: string): Promise<void> {
        await this.Task.findOneAndUpdate(
            { area: area },
            { status: taskStatus.snoozed, $inc: { snoozedTimes: 1 } }
        );
    }

    async fetchNewTasks(): Promise<TaskType[]> {
        const tasks: TaskType[] = await this.Task.find({
            status: taskStatus.new,
        });
        return tasks;
    }
    async fetchPendingTasks(): Promise<TaskType[]> {
        const tasks: TaskType[] = await this.Task.find({
            status: {
                $in: [taskStatus.new, taskStatus.snoozed, taskStatus.pending],
            },
        });
        return tasks;
    }

    private async findUserByName(userName: string): Promise<IUser> {
        let user: IUser | null = await this.User.findOne({ name: userName });
        if (user) {
            return user;
        } else {
            throw new Error(`User ${userName} not found in DB.`);
        }
    }
}
