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

export interface user extends ObjectId {
    name: string;
    TG: {
        username: string;
        tgId: number;
    };
    rating: number;
}

export interface IWeek {
    summary: string;
    startDate: string;
    events: IEvent[];
    isCurrent: boolean;
}

export interface IEvent {
    userId: Types.ObjectId;
    area: string;
    description?: string;
}

export interface ISchema {
    userTGId: number,
    username: string,
    area: string,
    description: string,
}