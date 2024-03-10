export interface IScheduler {
    monday(): Promise<void>;
    testCheck(): Promise<void>;
}