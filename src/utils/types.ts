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
    imgUrl?: string;
};

export type UserType = {
    _id: ObjectId;
    name: string;
    TG: {
        username: string;
        tgId: number;
    };
    rating: number;
};

export type CalendarEventType = {
    start: {
        date: string;
    };
    summary: string;
    description?: string;
};

export type CalendarType = {
    items: CalendarEventType[];
};

export type ImageRepType = {
    [key: string]: string;
};
