import { nostromoChatOpt, tgUserReplyOption } from "../utils/constants";
import { msgImage } from "../utils/images";
import { MarkupCBData, MessageType, TaskType } from "../utils/types";
import { Markup } from "telegraf";
import { IMessageService } from "./message.interface";
// import script from "../utils/dialogues.json"

export class MessageService implements IMessageService {
    constructor() {}

    talkNostromo(option: nostromoChatOpt, tasks?: TaskType[]): MessageType {
        if (!process.env.CHAT_ID) {
            console.error("Chat ID is not provided.");
        }
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: Number(process.env.CHAT_ID),
            imgUrl: msgImage.nostromo,
        };
        let text = "**USCSS Nostromo alarm and notification system.**\n";
        switch (option) {
            case nostromoChatOpt.schedule:
                if (!tasks) {
                    throw new Error(
                        "No tasks provided for a chat notification."
                    );
                }
                text += "Following is this week's watch duty assignments:\n";
                for (const task of tasks) {
                    text += `${task.userName} is assigned to the ${task.area} compartment.\n`;
                }
                text +=
                    "Attention Assigned Crew: A briefing will be delivered to your personal terminals shortly by supervising officers. Please be ready to receive the information.";
                message.imgCap = { caption: text };
                break;
            case nostromoChatOpt.helpGalley:
                message.imgCap = {
                    caption:
                        "Attention Crew: Whatchman in the Galley requested for an assistance. Please be responsive to your crewmate.",
                };
                break;
        }
        return message;
    }
    talkDallas(task: TaskType): MessageType {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
            text: "Your options:",
            imgUrl: msgImage.dallas,
        };
        let cbData = [];
        let text = "";
        if (task.area === "Galley") {
            text = `Cpt Dallas: \nCaptain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}. It's a tough shift, you have to continiously perform your duties until Sunday.`;
        } else {
            text = `Cpt Dallas: \nCaptain Dallas speaking, according to the ship's schedule you were assigned to watch duty in the ${task.area}.`;
        }
        message.imgCap = { caption: text };
        const load = {
            taskId: task._id,
            replyOption: tgUserReplyOption.confirm,
        };
        cbData.push(load);
        message.markup = this.getMarkup(cbData);
        return message;
    }
    replyDallas(task: TaskType): MessageType {
        const message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            text: `Cpt Dallas:\n Good. Officer Ripley will check up on you on Thursday. \nYour objectives are: \n${task.description}`,
            ID: task.TGId,
        };
        return message;
    }
    talkRipley(task: TaskType): MessageType {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
            text: "Your options:",
            imgUrl: msgImage.ripley,
        };
        let load0, load1;
        let text = "";
        if (task.area === "Galley") {
            text = `Ripley: \nThis is Warrant officer Ellen Ripley here, how is your shift in the Galley? We all know it's tough in there. Let me know if you need a hand.`;
            load0 = {
                taskId: task._id,
                replyOption: tgUserReplyOption.snoozeGalley,
            };
            load1 = {
                taskId: task._id,
                replyOption: tgUserReplyOption.help,
            };
        } else {
            text = `Ripley: \nThis is Warrant officer Ellen Ripley here, how is it going in the ${task.area}? How's the progress?`;
            load0 = {
                taskId: task._id,
                replyOption: tgUserReplyOption.done,
            };
            load1 = {
                taskId: task._id,
                replyOption: tgUserReplyOption.snooze,
            };
        }
        message.imgCap = { caption: text };
        message.markup = this.getMarkup([load0, load1]);
        return message;
    }
    replyRipley(task: TaskType, option?: tgUserReplyOption): MessageType {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
        };
        if (option === tgUserReplyOption.help) {
            message.text =
                "Ripley:\n Understood. I'll give a call to the crew and send somebody in.";
        } else {
            message.text = "Ripley:\n Ok, hang on. I'll check up on you later.";
        }
        return message;
    }
    talkKane(task: TaskType): MessageType {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
            text: "Your options:",
            imgUrl: msgImage.kane,
        };
        let text = "";
        if (task.area === "Galley") {
            text = `Kane: \nExecutive officer Kane online, your watch in ${task.area} compartment is over. Well done, take a rest and have that beer.`;
        } else {
            text = `Kane: \nExecutive officer Kane online, I see you still haven't complete your watch in ${task.area} compartment. Please hurry up, the beer is waiting.`;
        }
        const load0 = {
            taskId: task._id,
            replyOption: tgUserReplyOption.done,
        };
        message.imgCap = { caption: text };
        message.markup = this.getMarkup([load0]);
        return message;
    }
    replyKane(task: TaskType): MessageType {
        let message: MessageType = {
            // ID: Number(process.env.TEST_ID),
            ID: task.TGId,
            text: "Kane:\n Great! Now we're ready to investigate that distress signal the Mother woke up us for.",
        };
        return message;
    }

    private getMarkup(cbData: MarkupCBData[]) {
        let markup;
        let callbackData = "";
        let buttons = [];
        for (let data of cbData) {
            switch (data.replyOption) {
                case tgUserReplyOption.confirm:
                    callbackData = JSON.stringify(data);
                    buttons.push([
                        Markup.button.callback(
                            "Receive the assignment.",
                            callbackData
                        ),
                    ]);
                    break;
                case tgUserReplyOption.done:
                    callbackData = JSON.stringify(data);
                    buttons.push([
                        Markup.button.callback(
                            "Report to the captain: all done!",
                            callbackData
                        ),
                    ]);
                    break;
                case tgUserReplyOption.snooze:
                    callbackData = JSON.stringify(data);
                    buttons.push([
                        Markup.button.callback(
                            "Still in progress, need more time.",
                            callbackData
                        ),
                    ]);
                    break;
                case tgUserReplyOption.snoozeGalley:
                    callbackData = JSON.stringify(data);
                    buttons.push([
                        Markup.button.callback(
                            "It's fine, I got this.",
                            callbackData
                        ),
                    ]);
                    break;
                case tgUserReplyOption.help:
                    callbackData = JSON.stringify(data);
                    buttons.push([
                        Markup.button.callback(
                            "Actually, I might use some help in here.",
                            callbackData
                        ),
                    ]);
                    break;
            }
        }
        markup = Markup.inlineKeyboard(buttons);
        return markup;
    }
}
