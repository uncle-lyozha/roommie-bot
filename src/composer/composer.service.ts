import { IDBService } from "../db/db.interface";
import { IMailman } from "../mailman/mailman.interface";
import { IComposer } from "./composer.interface";

export class ComposerService implements IComposer {
    private db: IDBService;
    private mailman: IMailman;

    constructor(db: IDBService, mailman: IMailman) {
        this.db = db;
        this.mailman = mailman;
    }

    async composeTGMessage() {

    }
}
