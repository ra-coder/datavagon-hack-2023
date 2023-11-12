import React from 'react';

type AvailableType = 'train' | 'wagon' | 'main';
export interface UrlParams {
    type: AvailableType;
    id?: string;
    moment?: number;
    wagonId?: number;
}

const availableTypes: AvailableType[] = ['train', 'wagon'];
export function getParamsFromPath(): UrlParams {
    const path = window.location.pathname;
    const pathArryied = path.split('/');
    const type = pathArryied[1] as AvailableType;
    const id = pathArryied[2];

    const searchParams = new URLSearchParams(window.location.search);
    const moment = Number(searchParams.get('moment')) || undefined;
    const wagonId = Number(searchParams.get('wagonId')) || undefined;

    return {
        type: availableTypes.includes(type) ? type : 'main',
        id,
        moment,
        wagonId,
    };
}

const historyWatchers: (() => void)[] = [];
export const pushHistory = (title: string, query?: Record<string, any>) => {
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

export function useWatchHistory(): UrlParams {
    const [params, setParams] = React.useState(getParamsFromPath());

    React.useEffect(() => {
        historyWatchers.push(() => {
            setParams(getParamsFromPath());
        });
    }, []);

    return params;
}
