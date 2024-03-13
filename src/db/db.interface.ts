import { TaskType } from "../utils/types";

export interface IDBService {
    populateTasks(): Promise<void>;
    setFailedTaskStatuses(): Promise<void>;
    setPendingTaskStatus(taskId: string): Promise<void>;
    setDoneTaskStatus(taskId: string): Promise<void>;
    setSnoozedTaskStatus(taskId: string): Promise<void>;
    deleteAllTasks(): Promise<void>;
    fetchTaskById(id: string): Promise<TaskType>;
    fetchNewTasks(): Promise<TaskType[]>;
    fetchPendingTasks(): Promise<TaskType[]>;
}
