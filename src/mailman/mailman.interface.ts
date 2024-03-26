import { MessageType } from "../utils/types";

export interface IMailman {
    sendToTg(message: MessageType): Promise<void>;
}
