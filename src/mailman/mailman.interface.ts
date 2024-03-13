import { MessageType } from "../utils/types";

export interface IMailman {
    sendToTG(message: MessageType): Promise<void>;
}
