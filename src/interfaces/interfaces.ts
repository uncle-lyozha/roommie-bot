export type event = {
    start: {
        date: string;
    };
    summary: string;
};

export interface calendar {
    items: [
        {
            start: {
                date: string;
            };
            summary: string;
        }
    ];
}