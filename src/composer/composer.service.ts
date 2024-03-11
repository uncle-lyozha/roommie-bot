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
        let message: MessageType = {
            ID: 268482275,
            text: "",
        };
        const tasks = await this.db.fetchNewTasks();
        let text: string = "This week on duty:\n";
        for (const task of tasks) {
            text += `${task.userName} is responsible for ${task.area}. \n`;
        }
        message.text = text;
        return message;
    }

    async composeTGPrivateMessage(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            ID: 268482275,
            text: "",
            markup: [],
            task: task,
        };
        // message.ID = task.TGId;
        message.text = `${task._id} \n${task.area} shift...\n Congratulations! This week you are responsible for ${task.area}.\nYour tasks are: ${task.description}\n`;
        message.markup = Markup.inlineKeyboard([
            [Markup.button.callback("Gotcha 👍", tgUserReplyOption.confirm)],
        ] as any);
        return message;
    }

    async composeTGRepeatingPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            ID: 268482275,
            text: "",
            markup: [],
            task: task,
        };
        // message.ID = task.TGId;
        message.text = `${task._id} \n${task.area} shift...\n Hi, I got back to remind you something! This week you are responsible for ${task.area}!
        Here's what you should do:\n ${task.description}`;
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "The job is done! 🤌 🕶️",
                    tgUserReplyOption.done
                ),
            ],
            [Markup.button.callback("Snooze... 🦥", tgUserReplyOption.snooze)],
        ] as any);
        return message;
    }

    async composeFinalPM(task: TaskType): Promise<MessageType> {
        let message: MessageType = {
            ID: 268482275,
            text: "",
            markup: [],
            task: task,
        };
        // message.ID = task.TGId;
        message.text = `${task._id} \n${task.area} shift...\n Final reminder! Please clean the ${task.area}.\nYour tasks are: ${task.description} `;
        message.markup = Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    "No more snoozes, do it and hit me 👍",
                    tgUserReplyOption.done
                ),
            ],
        ] as any);
        return message;
    }
}
