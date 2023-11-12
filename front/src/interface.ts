import {YMapLocationRequest} from '@yandex/ymaps3-types';

export interface Train {
    name: string;
    train_index: string;
}

export interface Wagon {
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
    vagon: Wagon;
    events: TimeEventWagon[];
}

export interface WagonEventsParsed {
    train: Train;
    route: {
        start: Dislocation;
        end: Dislocation;
    };
    duration: number;
    moment: {
        start: number;
        end: number;
    };
    mapData: {
        dislocation: Dislocation;
        moment: number;
    }[];
}

export interface WagonTimelineParsed extends WagonTimeline {
    parsedEvents: WagonEventsParsed[];
}

export type SetMapLocation = React.Dispatch<React.SetStateAction<YMapLocationRequest>>;

export interface IdealPath {
    path: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    }[];
}
