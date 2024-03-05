import { ObjectId } from "mongoose";
import { Schema, Types } from "mongoose";

export interface ICalendarEvent {
    start: {
        date: string;
    };
    summary: string;
    description?: string;
}

export interface ICalendar {
    items: ICalendarEvent[];
}

export interface IUser {
    _id: ObjectId;
    name: string;
    TG: {
        username: string;
        tgId: number;
    };
    rating: number;
}

export interface IWeek {
    _id: ObjectId;
    summary: string;
    startDate: string;
    events: IEvent[];
    isCurrent: boolean;
}

export interface IEvent {
    // _id: ObjectId;
    userId: Types.ObjectId;
    area: string;
    description: string;
}

export interface ISnooze {
    _id: ObjectId;
    TGId: number;
    userName: string;
    area: string;
    description: string
}