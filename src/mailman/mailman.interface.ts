import { MessageType } from "../utils/types";

export interface IMailman {
    sendToTg(message: MessageType): Promise<void>;
    sendKeyboardToTG(message: MessageType): Promise<void>;
    sendPictureToTG(message: MessageType): Promise<void>;
}
