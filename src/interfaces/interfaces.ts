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