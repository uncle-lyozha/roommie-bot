import { nostromoChatOpt, tgUserReplyOption } from "../utils/constants";
import { MessageType, TaskType } from "../utils/types";

export interface IMessageService {
    talkNostromo(option: nostromoChatOpt, tasks?: TaskType[]): MessageType;
    talkDallas(task: TaskType): MessageType;
    replyDallas(task: TaskType): MessageType
    talkRipley(task: TaskType): MessageType 
    replyRipley(task: TaskType, option?: tgUserReplyOption): MessageType
    talkKane(task: TaskType, option: nostromoChatOpt): MessageType 
    replyKane(task: TaskType): MessageType
}