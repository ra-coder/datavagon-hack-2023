import type {TrainTimeline, WagonTimeline} from './interface';

export const backendUrl = 'http://158.160.26.131:8000/api/v1';

const MOMENT_TO_TIMESTAMP = 1 / 1000;

export function getTrainTimeLine(id: string, moment: number, wagonId?: number): Promise<TrainTimeline> {
    if (wagonId) {
        return request(`${backendUrl}/train/${id}/timeline`);
    }
    return request(`${backendUrl}/train/${id}/timeline?on_timestamp=${moment * MOMENT_TO_TIMESTAMP}`);
}

export function getTrainsList(moment: number, timeWindow?: number) {
    return request(`${backendUrl}/trains?on_timestamp=${moment * MOMENT_TO_TIMESTAMP}&window_secs=${timeWindow}`);
}

export function getStations() {
    return request(`${backendUrl}/stations`);
}

export async function getWagonTimeLine(id: string, moment: number): Promise<WagonTimeline> {
    return request(`${backendUrl}/vagon/${id}/timeline?on_timestamp=${moment * MOMENT_TO_TIMESTAMP}`);
}

function request(url: string) {
    return fetch(url).then((d) => d.json());
}
