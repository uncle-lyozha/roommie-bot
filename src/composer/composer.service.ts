import { Markup } from "telegraf";
import { IDBService } from "../db/db.interface";
import { MessageType, SceneOptionType, TaskType } from "../utils/types";
import { IComposer } from "./composer.interface";
import { scriptOpt, tgUserReplyOption } from "../utils/constants";
import { msgImage } from "../utils/images";

export class ComposerService implements IComposer {
    private db: IDBService;

    constructor(db: IDBService) {
        this.db = db;
    }

    async composeTGChatMsg(tasks?: TaskType[]): Promise<MessageType> {
        if (!process.env.CHAT_ID) {
            console.error("Chat ID is not provided.");
        }
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: Number(process.env.CHAT_ID),
            imgUrl: msgImage.nostromo,
        };
        let text = "**USCSS Nostromo alarm and notification system.**\n";
        if (tasks) {
            text += "Following is this week's watch duty assignments:\n";
            for (const task of tasks) {
                text += `${task.userName} is assigned to the ${task.area} compartment.\n`;
            }
            text +=
                "Attention Assigned Crew: A briefing will be delivered to your personal terminals shortly by supervising officers. Please be ready to receive the information.";
            message.imgCap = { caption: text };
        } else {
            message.imgCap = {
                caption:
                    "Attention Crew: Whatchman in the Galley requested for an assistance. Please be responsive to your crewmate.",
            };
        }
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
        };
        const callbackData = JSON.stringify(data);
        message.markup = Markup.inlineKeyboard([
            [Markup.button.callback("Receive the assignment.", callbackData)],
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
            let data = {
                taskId: task._id,
                replyOption: tgUserReplyOption.snooze,
            };
            const callbackDataSnooze = JSON.stringify(data);
            data.replyOption = tgUserReplyOption.help;
            const callbackDataHelp = JSON.stringify(data);
            message.markup = Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "It's fine, I got this.",
                        callbackDataSnooze
                    ),
                ],
                [
                    Markup.button.callback(
                        "Actually, I might use some help in here.",
                        callbackDataHelp
                    ),
                ],
            ] as any);
        } else {
            message.text = `Ripley: This is Warrant officer Ellen Ripley here, how is it going in the ${task.area}? How's the progress?`;
            let data = {
                taskId: task._id,
                replyOption: tgUserReplyOption.snooze,
            };
            const callbackDataSnooze = JSON.stringify(data);
            data.replyOption = tgUserReplyOption.done;
            const callbackDataDone = JSON.stringify(data);
            message.markup = Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "Report to the captain: all done!",
                        callbackDataDone
                    ),
                ],
                [
                    Markup.button.callback(
                        "Still in progress, need more time.",
                        callbackDataSnooze
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
            message.text = `Kane: \nExecutive officer Kane online, your watch in ${task.area} compartment is over. Well done, take a rest and have that beer.`;
        } else {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} shift... \n<b>Kane:</b> \nExecutive officer Kane online, I see you still haven't complete your watch in ${task.area} compartment. Please hurry up, the beer is waiting.`;
        }
        message.imgUrl = msgImage.kane;
        let data = {
            taskId: task._id,
            replyOption: tgUserReplyOption.done,
        };
        const callbackDataDone = JSON.stringify(data);
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "File the complition report.",
                    callbackDataDone
                ),
            ],
        ] as any);
        return message;
    }

    async composeTGDallasPM(task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.dallas,
            imgCap: {
                caption: `Cpt Dallas:\n Good. Officer Ripley will check up on you on Thursday. \nYour objectives are: \n${task.description}`,
            },
        };
        return message;
    }
    async composeTGRipleyPM(task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.ripley,
            imgCap: {
                caption: "Ripley:\n Ok, hang on. I'll check up on you later.",
            },
        };
        return message;
    }
    async composeTGRipleyHelpPM(task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.ripley,
            imgCap: {
                caption:
                    "Ripley:\n Understood. I'll give a call to the crew and send somebody in.",
            },
        };
        return message;
    }
    async composeTGKanePM(task: TaskType) {
        let message: MessageType = {
            ID: task.TGId,
            imgUrl: msgImage.kane,
            imgCap: {
                caption:
                    "Kane:\n Great! Now we're ready to investigate that distress signal the Mother woke up us for.",
            },
        };
        return message;
    }
}
