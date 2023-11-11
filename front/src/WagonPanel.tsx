import React from 'react';

import { getWagonIdFromPath, stringidyDate } from './utils';
import { getWagonInfo } from './requests';
import type {TimeEventWagon, WagonTimeline, Train, Dislocation} from './interface';

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

interface WagonEventsParsed {
    train: Train;
    route: {
        start: Dislocation;
        end: Dislocation;
    };
    duration: number;
    moment: {
        start: number;
        end: number;
    }
}

const parseWagonEvents = (wagonEvents: TimeEventWagon[]): WagonEventsParsed[] => {
    const res: WagonEventsParsed[] = [];

    let endMoment: number;
    let endDislocaion: Dislocation;
    for (let i = wagonEvents.length - 1; i >= 0; i--) {
        const curEvent = wagonEvents[i];
        if (i === wagonEvents.length - 1) {
            endMoment = curEvent.moment;
            endDislocaion = curEvent.dislocation;
            continue;
        }
        const prevEvent = wagonEvents[i + 1];
        // if (i === 0) {
        //     continue;
        // }

        if (curEvent.train.train_index !== prevEvent.train.train_index) {
            res.push({
                train: prevEvent.train,
                route: {
                    start: prevEvent.dislocation,
                    end: endDislocaion!,
                },
                duration: endMoment! - prevEvent.moment,
                moment: {
                    start: prevEvent.moment,
                    end: endMoment!,
                }
            });
            continue;
        }

        /* Можно аккамулировать информацию по одному поезду в этом месте */
    }

    return res;
}

const WagonPanel: React.FC = () => {
    const [wagonInfo, setWagonInfo] = React.useState<WagonTimeline | null>(null);
    const wagonId = getWagonIdFromPath();

    React.useEffect(() => {
        if (wagonId) {
            getWagonInfo(wagonId).then((v) => {
                console.log(v);
                setWagonInfo(v);
            }).catch(e => {
                setWagonInfo(null);
                console.error(e);
            })
        }
    }, [wagonId]);

    if (!wagonId || !wagonInfo) {
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

    const renderEvent = (ev: WagonEventsParsed) => {
        const train = ev.train;
        const route = ev.route;
        const moment = ev.moment;
        const [startDate, startTime]  = stringidyDate(new Date(moment.start * 1000))
        const [endDate, endTime]  = stringidyDate(new Date(moment.end * 1000))
        return (
            <div key={ev.train.train_index} className='WagonPanel__time-event'>
                {renderRow('Поезд', `${train.name} ${train.train_index}`)}
                {renderRow('Время в пути', renderDuration(ev.duration))}
                {renderRow('Станции', `${route.start.id} ${route.end.id}`)}
                {renderRow('Время',
                    `${startDate} ${startTime} - ${endDate} ${endTime}`)}
            </div>
        )
    }

    const wagon = wagonInfo.vagon;
    const events = parseWagonEvents(wagonInfo.events);
    console.log(events);

    return (
        <div className='WagonPanel'>
            <div className='WagonPanel__title'>
                {wagon.name} {wagon.id}
            </div>
            <div className='WagonPanel__time-events'>
                {events.map(renderEvent)}
            </div>
        </div>
    )
}

export { WagonPanel };
