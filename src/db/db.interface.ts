import { ObjectId } from "mongoose";
import { ISnooze, IWeek } from "../interfaces/interfaces";
import { TaskType } from "../utils/types";

export interface IDBService {
    populateTasks(): Promise<void>;
    updateTaskStatuses(): Promise<void>;
    setPendingTaskStatus(area: string): Promise<void>;
    fetchNewTasks(): Promise<TaskType[]>;

    // findCurrentWeek(): Promise<IWeek>;
    // updateCurrentWeek(): Promise<void>;
    // getSnoozers(): Promise<ISnooze[]>;
    // addNewSnooze(
    //     TGId: number,
    //     userName: string,
    //     area: string,
    //     description: string
    // ): Promise<void>;
    // deleteSnooze(id: ObjectId): Promise<void>;
}
