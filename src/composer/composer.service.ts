import { Markup } from "telegraf";
import { IDBService } from "../db/db.interface";
import { MessageType, TaskType } from "../utils/types";
import { IComposer } from "./composer.interface";
import { tgUserReplyOption } from "../utils/constants";

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
        message.text =
            text +
            "\n **Attention Assigned Crew:** A briefing will be delivered to your personal terminals shortly by supervising officers. Please be ready to receive the information.";
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
        if (task.area === "Galley") {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} compartment shift... \n**Cpt Dallas:** Captain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}. It's a tough shift, you have to continiously perform your duties until Sunday.`;
        } else {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} compartment shift... \n**Cpt Dallas:** Captain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}.`;
        }
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "Receive the assignment.",
                    tgUserReplyOption.confirm
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
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} compartment shift... \n**Ripley:** This is Warrant officer Ellen Ripley here, how is your shift in the ${task.area}? We all know it's tough in there. Let me know if you need a hand.`;
            message.markup = Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "It's fine, I got this.",
                        tgUserReplyOption.snooze
                    ),
                ],
                [
                    Markup.button.callback(
                        "Actually, I might use some help in here.",
                        tgUserReplyOption.help
                    ),
                ],
            ] as any);
        } else {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} compartment shift... \n**Ripley:** This is Warrant officer Ellen Ripley here, how is it going in the ${task.area}? How's the progress?`;
            message.markup = Markup.inlineKeyboard([
                [
                    Markup.button.callback(
                        "Report to the captain: all done!",
                        tgUserReplyOption.done
                    ),
                ],
                [
                    Markup.button.callback(
                        "Still in progress, need more time.",
                        tgUserReplyOption.snooze
                    ),
                ],
            ] as any);
        }
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
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} shift... \n**Kane:** Executive officer Kane online, your watch in ${task.area} compartment is over. Well done, take a rest and have that beer.`;
        } else {
            message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} shift... \n**Kane:** Executive officer Kane online, I see you still haven't complete your watch in ${task.area} compartment. Please hurry up, the beer is waiting.`;
        }
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "File the complition report.",
                    tgUserReplyOption.done
                ),
            ],
        ] as any);
        return message;
    }
}
