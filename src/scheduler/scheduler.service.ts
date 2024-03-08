import * as cron from "node-cron";
import { IComposer } from "../composer/composer.interface";
import { IDBService } from "../db/db.interface";
import { IScheduler } from "./scheduler.interface";

export class SchedulerService implements IScheduler {
    private composer: IComposer;
    private db: IDBService;

    constructor(composer: IComposer, db: IDBService) {
        this.composer = composer;
        this.db = db;
    }

    async monday() {
        cron.schedule("0 11 * * 1", async () => {
            console.log("For whom the Moday bell tolls.");
            await this.db.populateTasks();
        });
    }
}
