import * as mongoose from "mongoose";
import { Schema, Types } from "mongoose";
import { IWeek } from "../interfaces/interfaces";

export const WeekSchema = new Schema<IWeek>({
    summary: { type: String, required: true },
    startDate: { type: String, required: true },
    events: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            area: { type: String, required: true },
            description: { type: String, required: true },
        },
    ],
    isCurrent: { type: Boolean },
});
