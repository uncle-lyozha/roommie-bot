import { ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { Schema, Types } from "mongoose";

export interface event {
    start: {
        date: string;
    };
    summary: string;
    description?: string;
}

export interface calendar {
    items: event[];
}

export interface user {
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