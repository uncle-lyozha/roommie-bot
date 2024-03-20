import { Schema } from "mongoose";

export const Message = new Schema({
    author: {
        firstName: {type: String, required: true},
        secondName: {type: String, required: true},
        rank: {type: String, required: true}
    },
    subject: {type: String, required: true},
    text: {type: String, required: true},
    comment: {type: String, required: true}
})