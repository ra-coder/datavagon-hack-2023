import {YMapLocationRequest} from '@yandex/ymaps3-types';

export interface Train {
    name: string;
    train_index: string;
}

interface Vagon {
    name: string;
    id: string;
}

export interface Dislocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export interface TimeEventTrain {
    moment: number;
    vagon_ids: number[];
    dislocation: Dislocation;
}

export interface TrainTimeline {
    train: Train;
    events: TimeEventTrain[];
}

export interface TimeEventWagon {
    train: Train;
    moment: number;
    dislocation: Dislocation;
}

export interface WagonTimeline {
    vagon: Vagon;
    events: TimeEventWagon[];
}

export type SetMapLocation = React.Dispatch<React.SetStateAction<YMapLocationRequest>>;
