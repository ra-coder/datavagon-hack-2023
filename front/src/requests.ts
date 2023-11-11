import type { TrainTimeline, WagonTimeline } from "./type";

const HOST = 'http://158.160.26.131:8000';

const getTrainInfo = async (train_index: string): Promise<TrainTimeline> => {
    return fetch(`${HOST}/api/v1/train/${train_index}/timeline`).then(d => d.json());
}

const getWagonInfo = async (wagonId: string): Promise<WagonTimeline> => {
    return fetch(`${HOST}/api/v1/vagon/${wagonId}/timeline`).then(d => d.json());
}

export {
    getTrainInfo,
    getWagonInfo,
}
