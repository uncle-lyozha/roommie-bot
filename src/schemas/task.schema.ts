import { Schema } from "mongoose";

export const TaskSchema = new Schema({
    userName: { type: String, required: true },
    TGId: { type: Number, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    date: {type: Date}
});
