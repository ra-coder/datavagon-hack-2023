import {LngLat} from '@yandex/ymaps3-types';
import type {Dislocation, TimeEventTrain, TrainTimeline} from './interface';

export const stringifyDate = (dateMoment: Date): [string, string] => {
    const date = dateMoment.getFullYear() + "-" +
    (dateMoment.getMonth() + 1).toString().padStart(2, '0') + "-" +
    dateMoment.getDate().toString().padStart(2, '0');

    const time = dateMoment.getHours().toString().padStart(2, '0') + ":" +
        dateMoment.getMinutes().toString().padStart(2, '0') + ":" +
        dateMoment.getSeconds().toString().padStart(2, '0');

    return [date, time];
}
export function getLngLat(event: Dislocation | {dislocation: Dislocation}): LngLat {
    const point = 'dislocation' in event ? event.dislocation : event;
    return [point.longitude, point.latitude];
}

export function compactTrainTimeLineEvents(timeline: TrainTimeline, wagonId?: number) {
    return timeline.events.reduce<TimeEventTrain[]>((acc, currentEvent, index, array) => {
        if (wagonId) {
            if (!currentEvent.vagon_ids.includes(wagonId)) {
                return acc;
            }
            if (index === array.length - 1) {
                acc.push(currentEvent);
            } else if (index === 0) {
                return acc;
            } else if (currentEvent.dislocation.id !== array[index - 1].dislocation.id) {
                acc.push(array[index - 1]);
            }
        } else {
            if (index === array.length - 1) {
                acc.push(currentEvent);
            } else if (index === 0) {
                return acc;
            } else if (currentEvent.dislocation.id !== array[index - 1].dislocation.id) {
                acc.push(array[index - 1]);
            }
        }

        return acc;

    }, [])
}
