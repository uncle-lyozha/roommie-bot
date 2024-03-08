export interface IMailman {
    sendToTG(ID: number, message: string, keyboard?: any[]): Promise<void>;
}
