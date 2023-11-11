import {LngLat} from "@yandex/ymaps3-types";
import type {TrainEvent} from "./interface";

const pushHistory = (title: string) => {
    window.history.pushState(null, '', `/${title}`);
}

const getTrainIndexFromPath = (): string | undefined => {
    const path = window.location.pathname;
    const pathArryied = path.split('/');
    if (pathArryied[1] !== 'train') {
        return undefined;
    }

    return pathArryied[2];
}

const getWagonIdFromPath = (): string | undefined => {
    const path = window.location.pathname;
    const pathArryied = path.split('/');
    if (pathArryied[1] !== 'wagon') {
        return undefined;
    }

    return pathArryied[2];
}

const stringidyDate = (dateMoment: Date): [string, string] => {
    const date = dateMoment.getFullYear() + "-" +
    (dateMoment.getMonth() + 1).toString().padStart(2, '0') + "-" +
    dateMoment.getDate().toString().padStart(2, '0');

    const time = dateMoment.getHours().toString().padStart(2, '0') + ":" +
        dateMoment.getMinutes().toString().padStart(2, '0') + ":" +
        dateMoment.getSeconds().toString().padStart(2, '0');

    return [date, time];
}

export const backendUrl = 'http://158.160.26.131:8000/api/v1';

export function getLngLat(event: TrainEvent): LngLat {
    return [event.dislocation.longitude, event.dislocation.latitude];
}

export {
    pushHistory,
    getTrainIndexFromPath,
    stringidyDate,
    getWagonIdFromPath,
};
