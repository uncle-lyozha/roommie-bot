import { ObjectId } from "mongoose";
import { ISnooze, IWeek } from "../interfaces/interfaces";

export interface IDBService {
    populateTasks(): Promise<void>;
    
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
