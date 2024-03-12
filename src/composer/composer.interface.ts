import { MessageType, TaskType } from "../utils/types";

export interface IComposer {
    composeTGChatMessage(): Promise<MessageType>;
    composeTGInitialPM(task: TaskType): Promise<MessageType>;
    composeTGRepeatingPM(task: TaskType): Promise<MessageType>;
    composeTGFinalPM(task: TaskType): Promise<MessageType>;
}