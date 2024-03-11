import { taskStatus } from "./constants";
import { ObjectId } from "mongoose";

export type TaskType = {
    _id: ObjectId;
    userName: string;
    TGId: number;
    area: string;
    description: string;
    status: taskStatus;
    date: Date;
    snoozedTimes: number;
};

export type MessageType = {
    ID: number;
    text: string;
    markup?: any;
    task?: TaskType;
};
