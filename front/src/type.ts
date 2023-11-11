interface Train {
    name: string;
    train_index: string;
}
interface Vagon {
    name: string;
    id: string;
}
interface Dislocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}
interface TimeEventTrain {
    moment: number
    vagon_ids: number[];
    dislocation: Dislocation;
}

interface TimeEventWagon {
    train: Train;
    moment: number;
    dislocation: Dislocation;
}

interface TrainTimeline {
    train: Train;
    events: TimeEventTrain[];
}

interface WagonTimeline {
    vagon: Vagon;
    events: TimeEventWagon[];
}

export type {
    Train,
    Dislocation,
    TrainTimeline,
    TimeEventTrain,
    WagonTimeline,
    TimeEventWagon,
}
