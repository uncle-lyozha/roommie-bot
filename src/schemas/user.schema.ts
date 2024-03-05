import { Schema } from "mongoose";

export const UserSchema = new Schema({
    name: { type: String, required: true },
    TG: {
        username: { type: String, required: true },
        tgId: { type: Number, required: true },
    },
    rating: { type: Number, required: false },
});
