import { Markup } from "telegraf";
import { IDBService } from "../db/db.interface";
import { IMailman } from "../mailman/mailman.interface";
import { MessageType, TaskType } from "../utils/types";
import { IComposer } from "./composer.interface";

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
            task: task
        };
        // message.ID = task.TGId;
        message.text = `Congratulations! This week you are responsible for ${task.area}.\n Your tasks are: ${task.description} `;
        message.markup = Markup.inlineKeyboard([[Markup.button.callback("Gotcha 👍", "confirm")]] as any)
        console.log(message);
        return message;
    }
}
