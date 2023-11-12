import React from 'react';

import { stringifyDate } from './utils';
import type {Wagon, WagonEventsParsed, WagonTimelineParsed} from './interface';

import './WagonPanel.css';
/*
id
3001
9596
5952
6978
8247
5226
8680
5254
8907
8396
7001
9076
163
4515
3581
3472
7989
7839
1738
3547
7403
*/

const DAY_SECONDS = 86400;
const HOUR_SECONDS = 3600;

interface WagonPanelProps {
    id: string;
    timeline: WagonTimelineParsed;
    wagon: Wagon;
}

const WagonPanel: React.FC<WagonPanelProps> = ({
    id,
    wagon,
    timeline
}) => {
    if (!id) {
        return null;
    }

    const renderDuration = (duration: number): string => {
        if (duration === 0) {
            return '0';
        }
        const restSeconds = duration % DAY_SECONDS;
        const d = (duration - restSeconds) / DAY_SECONDS;
        const h = Math.floor(restSeconds / HOUR_SECONDS);
        return `${d}д. ${h}ч.`
    }

    const renderRow = (title: string, val: string) => {
        return (
            <div className='WagonPanel__row'>
                {title}: <span>{val}</span>
            </div>
        )
    }

    const renderEvent = (ev: WagonEventsParsed, i: number) => {
        const train = ev.train;
        const route = ev.route;
        const moment = ev.moment;
        const [startDate, startTime]  = stringifyDate(new Date(moment.start * 1000))
        const [endDate, endTime]  = stringifyDate(new Date(moment.end * 1000))
        return (
            <div key={i} className='WagonPanel__time-event'>
                {renderRow('Поезд', `${train.name} ${train.train_index}`)}
                {renderRow('Время в пути', renderDuration(ev.duration))}
                {renderRow('Станции', `${route.start.id} ${route.end.id}`)}
                {renderRow('Время',
                    `${startDate} ${startTime} - ${endDate} ${endTime}`)}
            </div>
        )
    }

    return (
        <div className='WagonPanel'>
            <div className='WagonPanel__title'>
                {wagon.name} {wagon.id}
            </div>
            <div className='WagonPanel__time-events'>
                {timeline.parsedEvents.map(renderEvent)}
            </div>
        </div>
    )
}

export { WagonPanel };
