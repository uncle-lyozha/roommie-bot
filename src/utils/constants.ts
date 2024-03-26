export enum taskStatus {
    new = "new",
    pending = "pending",
    snoozed = "snoozed",
    done = "done",
    failed = "failed",
}

export enum tgUserReplyOption {
    confirm = "confirm",
    done = "done",
    snooze = "snooze",
    snoozeGalley = "snoozeG",
    help = "help",
}

export enum scriptOpt {
    dallasInit = "dallas0",
    dallasInitGalley = "dallas1",
    dallasReply = "dallas2",
    ripleyRemind = "ripley0",
    ripleyRemindGalley = "ripley1",
    ripleyReply = "ripley2",
    ripleyReplyHelp = "ripley3",
    kaneMsg = "kane0",
    kaneGalley = "kane1",
    kaneReply = "kane2"
}

export enum nostromoChatOpt {
    schedule = 1,
    helpGalley = 2
}
