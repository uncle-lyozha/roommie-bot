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
            ID: Number(process.env.TEST_ID),
            // ID: Number(process.env.OUR_CHAT),
            text: "",
        };
        const tasks = await this.db.fetchNewTasks();
        let text: string =
            "This is USCSS Nostromo alarm and notification system. \nFollowing is this week's duty assignments:\n";
        for (const task of tasks) {
            text += `${task.userName} is assigned to ${task.area} compartment. \n`;
        }
        message.text =
            text +
            "\n Attention Assigned Staff: A briefing will be delivered to your personal terminals shortly by supervising officers. Please be ready to receive the information.";
        return message;
    }

    async composeTGInitialPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            ID: Number(process.env.TEST_ID),
            // ID: task.TGId,
            text: "",
            markup: [],
            task: task,
        };
        message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} compartment shift... \nCaptain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}. \nYour duties: \n${task.description}.`;
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "Asignment received.",
                    tgUserReplyOption.confirm
                ),
            ],
        ] as any);
        return message;
    }

    async composeTGRepeatingPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            // ID: task.TGId,
            ID: Number(process.env.TEST_ID),
            text: "",
            markup: [],
            task: task,
        };
        message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} compartment shift... \nThis is Warrant officer Ellen Ripley here, how is it going in the ${task.area}? \nYou supposed to: \n${task.description}. How's the progress?`;
        message.markup = Markup.inlineKeyboard([
            [Markup.button.callback("Report to the captain: all done!", tgUserReplyOption.done)],
            [
                Markup.button.callback(
                    "Still in progress, need more time.",
                    tgUserReplyOption.snooze
                ),
            ],
        ] as any);
        return message;
    }

    async composeTGFinalPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            ID: Number(process.env.TEST_ID),
            // ID: task.TGId,
            text: "",
            markup: [],
            task: task,
        };
        message.text = `${task._id}: task ID, USCSS Nostromo log. \nSubject: ${task.area} shift... \nExecutive officer Kane online, I see you still haven't complete your watch in ${task.area} compartment. Please hurry up, gotta leave this rock A.S.A.P. \nTo remind your objectives: ${task.description}`;
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "Confirm completion.",
                    tgUserReplyOption.done
                ),
            ],
        ] as any);
        return message;
    }
}
