import * as mongoose from "mongoose";
import { Schema, Types } from "mongoose";
import { ISchema, IWeek } from "../interfaces/interfaces";

export const SnoozeSchema = new Schema<ISchema>({
    userTGId: { type: Number, required: true },
    username: { type: String, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true }
});
