import { MessageType } from "../utils/types";

export interface IMailman {
    sendKeyboardToTG(message: MessageType): Promise<void>;
    sendPictureToTG(message: MessageType): Promise<void>;
}
