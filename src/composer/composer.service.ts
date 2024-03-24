import { Markup } from "telegraf";
import { IDBService } from "../db/db.interface";
import { MessageType, TaskType } from "../utils/types";
import { IComposer } from "./composer.interface";
import { tgUserReplyOption } from "../utils/constants";
import { msgImage } from "../utils/images";

export class ComposerService implements IComposer {
    private db: IDBService;

    constructor(db: IDBService) {
        this.db = db;
    }

    async composeTGChatMessage(): Promise<MessageType> {
        if (!process.env.OUR_CHAT) {
            console.error("Chat ID is not provided.");
        }
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: Number(process.env.OUR_CHAT),
            text: "",
        };
        const tasks = await this.db.fetchNewTasks();
        let text: string =
            "**USCSS Nostromo alarm and notification system.** \nFollowing is this week's watch duty assignments:\n";
        for (const task of tasks) {
            text += `${task.userName} is assigned to ${task.area} compartment. \n`;
        }
        const messageText =
            text +
            "Attention Assigned Crew: A briefing will be delivered to your personal terminals shortly by supervising officers. Please be ready to receive the information.";
        message.imgUrl = msgImage.nostromo;
        message.imgCap = { caption: messageText };
        return message;
    }

    async composeTGInitialPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
            text: "",
            markup: [],
            task: task,
        };
        let text;
        if (task.area === "Galley") {
            text = `Cpt Dallas: \nCaptain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}. It's a tough shift, you have to continiously perform your duties until Sunday.`;
        } else {
            text = `Cpt Dallas: \nCaptain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}.`;
        }
        message.imgCap = { caption: text };
        message.imgUrl = msgImage.dallas;
        let data = {
            taskId: task._id,
            replyOption: tgUserReplyOption.confirm,
        }
        const callbackData = JSON.stringify(data);
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "Receive the assignment.",
                    callbackData
                ),
            ],
        ] as any);
        return message;
    }

    async composeTGRepeatingPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            ID: task.TGId,
            // ID: Number(process.env.TEST_ID),
            text: "",
            markup: [],
            task: task,
        };
        if (task.area === "Galley") {
            message.text = `Ripley: \nThis is Warrant officer Ellen Ripley here, how is your shift in the ${task.area}? We all know it's tough in there. Let me know if you need a hand.`;
            message.markup = Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "It's fine, I got this.",
                        tgUserReplyOption.snooze + " " + task._id
                    ),
                ],
                [
                    Markup.button.callback(
                        "Actually, I might use some help in here.",
                        tgUserReplyOption.help  + " " + task._id
                    ),
                ],
            ] as any);
        } else {
            message.text = `Ripley: This is Warrant officer Ellen Ripley here, how is it going in the ${task.area}? How's the progress?`;
            message.markup = Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "Report to the captain: all done!",
                        tgUserReplyOption.done + " " + task._id
                    ),
                ],
                [
                    Markup.button.callback(
                        "Still in progress, need more time.",
                        tgUserReplyOption.snooze + " " + task._id
                    ),
                ],
            ] as any);
        }
        message.imgUrl = msgImage.ripley;
        return message;
    }

    async composeTGFinalPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
            text: "",
            markup: [],
            task: task,
        };
        if (task.area === "Galley") {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} shift... \n<b>Kane:</b> \nExecutive officer Kane online, your watch in ${task.area} compartment is over. Well done, take a rest and have that beer.`;
        } else {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} shift... \n<b>Kane:</b> \nExecutive officer Kane online, I see you still haven't complete your watch in ${task.area} compartment. Please hurry up, the beer is waiting.`;
        }
        message.imgUrl = msgImage.kane;
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "File the complition report.",
                    tgUserReplyOption.done + " " + task._id
                ),
            ],
        ] as any);
        return message;
    }

    async composeTGDallasPM (task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.dallas,
            imgCap: {caption: `Cpt Dallas:\n Good. Officer Ripley will check up on you on Thursday. \nYour objectives are: \n${task.description}`}
        };
        return message;
    }
    async composeTGRipleyPM (task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.ripley,
            imgCap: {caption: "Ripley:\n Ok, hang on. I'll check up on you later."}
        };
        return message;
    }
    async composeTGRipleyHelpPM (task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.ripley,
            imgCap: {caption: "Ripley:\n Understood. I'll give a call to the crew and send somebody in."}
        };
        return message;
    }
    async composeTGKanePM (task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.kane,
            imgCap: {caption: "Kane:\n Great! Now we're ready to investigate that distress signal the Mother woke up us for."}
        };
        return message;
    }
    
    composeTGChatHelp (){
        let message: MessageType = {
            ID: Number(process.env.OUR_CHAT),
            imgUrl: msgImage.nostromo,
            imgCap: {caption: "Kane:\n Great! Now we're ready to investigate that distress signal the Mother woke up us for."}
        };
        return message;

    }
}
