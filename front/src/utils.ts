import {LngLat} from "@yandex/ymaps3-types";
import type {TrainEvent} from "./interface";

const pushHistory = (title: string) => {
    window.history.pushState(null, '', `/${title}`);
}

export { pushHistory };

export const backendUrl = 'http://158.160.26.131:8000/api/v1';

export function getLngLat(event: TrainEvent): LngLat {
    return [event.dislocation.longitude, event.dislocation.latitude];
}
