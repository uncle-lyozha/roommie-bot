import { IWeek } from "../interfaces/interfaces";

export interface INotificationService {
    sendNotifications(currentWeek: IWeek, option: number): Promise<void>;
    sendReminder(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ): void;
    sendReminder(
        TGId: number,
        userName: string,
        area: string,
        description: string
    ): Promise<void>;
    sendChatNotification(week: IWeek): Promise<void>;
}
