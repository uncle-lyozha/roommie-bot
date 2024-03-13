import { TaskType } from "../utils/types";

export interface IDBService {
    populateTasks(): Promise<void>;
    setFailedTaskStatuses(): Promise<void>;
    setPendingTaskStatus(taskId: string): Promise<void>;
    fetchNewTasks(): Promise<TaskType[]>;
}
