export interface IScheduler {
    monday(): Promise<void>;
    repeating(): Promise<void>;
    sunday(): Promise<void>;
}