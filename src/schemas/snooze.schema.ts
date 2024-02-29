import { Schema } from "mongoose";
import { ISnooze } from "../interfaces/interfaces";

export const SnoozeSchema = new Schema<ISnooze>({
    TGId: { type: Number, required: true },
    userName: { type: String, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true }, 
});
