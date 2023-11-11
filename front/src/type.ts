interface TimeEvent {
    moment: number
    vagon_ids: number[];
    dislocation: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    },
}

interface TrainTimeline {
    train: {
        name: string;
        train_index: string;
    }
    events: TimeEvent[]
}

export type {
    TrainTimeline,
    TimeEvent,
}
