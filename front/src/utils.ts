import {LngLat} from '@yandex/ymaps3-types';
import type {TimeEventTrain, TrainTimeline} from './interface';
import React from 'react';

const historyWatchers: (() => void)[] = [];
const pushHistory = (title: string, query?: Record<string, any>) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (query) {
        Object.keys(query).forEach((key) => {
            searchParams.set(key, query[key].toString());
        })
    }

    window.history.pushState(null, '', `/${title}?${searchParams.toString()}`);
    historyWatchers.forEach((watcher) => watcher());
}

window.onpopstate = () => {
    historyWatchers.forEach((watcher) => watcher());
};

const getTrainIndexFromPath = (): string | undefined => {
    const {type, id} = getParamsFromPath();
    if (type !== 'train') return;

    return id;
}

type AvailableType = 'train' | 'wagon' | 'main';
export interface UrlParams {
    type: AvailableType;
    id?: string;
    moment?: number;
}

const availableTypes: AvailableType[] = ['train', 'wagon'];
export function getParamsFromPath(): UrlParams {
    const path = window.location.pathname;
    const pathArryied = path.split('/');
    const type = pathArryied[1] as AvailableType;
    const id = pathArryied[2];

    const searchParams = new URLSearchParams(window.location.search);
    const moment = Number(searchParams.get('moment')) || undefined;

    return {
        type: availableTypes.includes(type) ? type : 'main',
        id,
        moment
    };
}

export function useWatchHistory(): UrlParams {
    const [params, setParams] = React.useState(getParamsFromPath());

    React.useEffect(() => {
        historyWatchers.push(() => {
            setParams(getParamsFromPath());
        });
    }, []);

    return params;
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
export function getLngLat(event: TimeEventTrain): LngLat {
    return [event.dislocation.longitude, event.dislocation.latitude];
}

export function compactTrainTimeLineEvents(timeline: TrainTimeline) {
    return timeline.events.reduce<TimeEventTrain[]>((acc, currentEvent, index, array) => {
        if (index === array.length - 1) {
            acc.push(currentEvent);
        } else if (index === 0) {
            return acc;
        } else if (currentEvent.dislocation.id !== array[index - 1].dislocation.id) {
            acc.push(array[index - 1]);
        }

        return acc;

    }, [])
}

export {
    pushHistory,
    getTrainIndexFromPath,
    stringidyDate,
    getWagonIdFromPath,
};
