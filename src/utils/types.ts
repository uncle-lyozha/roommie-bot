import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { taskStatus } from "./constants";

export type TaskType = {
    userName: string;
    TGId: number;
    area: string;
    description: string;
    status: taskStatus;
    date: Date;
};

export type MessageType = {
    ID: number;
    text: string;
    markup?: any;
    task?: TaskType
    // markup?: InlineKeyboardMarkup;
};
