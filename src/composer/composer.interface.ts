import { MessageType, TaskType } from "../utils/types";

export interface IComposer {
    composeTGPrivateMessage(task: TaskType): Promise<MessageType>;
    composeTGChatMessage(): Promise<MessageType>;
}