import React from 'react';

import {stringifyDate} from '../utils';
import {pushHistory} from '../hooks/useHistory';
import type {Wagon, WagonEventsParsed, WagonTimelineParsed} from '../interface';

import './WagonPanel.css';

const DAY_SECONDS = 86400;
const HOUR_SECONDS = 3600;

interface WagonPanelProps {
    id: string;
    timeline: WagonTimelineParsed;
    wagon: Wagon;
}

const WagonPanel: React.FC<WagonPanelProps> = ({id, wagon, timeline}) => {
    if (!id) {
        return null;
    }

    const renderDuration = (duration: number): JSX.Element => {
        if (duration === 0) {
            return <span className="WagonPanel__green">0</span>;
        }
        const restSeconds = duration % DAY_SECONDS;
        const d = (duration - restSeconds) / DAY_SECONDS;
        const h = Math.floor(restSeconds / HOUR_SECONDS);
        if (d > 0) {
        }
        const classname = d > 0 ? 'WagonPanel__red' : 'WagonPanel__green';
        return (
            <span className={classname}>
                {d}д. {h}ч.
            </span>
        );
    };

    const renderRow = (title: string, val: React.ReactNode) => {
        return (
            <div className="WagonPanel__row">
                {title}: <span>{val}</span>
            </div>
        );
    };

    const renderEvent = (ev: WagonEventsParsed, i: number) => {
        const train = ev.train;
        const route = ev.route;
        const moment = ev.moment;
        const [startDate, startTime] = stringifyDate(new Date(moment.start * 1000));
        const [endDate, endTime] = stringifyDate(new Date(moment.end * 1000));
        const trainLine = (
            <a className="Link" onClick={() => pushHistory(`train/${train.train_index}`, {wagonId: wagon.id})}>
                {train.name} {train.train_index}
            </a>
        );

        return (
            <div key={i} className="WagonPanel__time-event">
                {renderRow('Поезд', trainLine)}
                {renderRow('Время в пути', renderDuration(ev.duration))}
                {renderRow('Станции', `${route.start.id} ${route.end.id}`)}
                {renderRow('Время', `${startDate} ${startTime} - ${endDate} ${endTime}`)}
            </div>
        );
    };

    return (
        <div className="WagonPanel">
            <div className="WagonPanel__title">
                {wagon.name} {wagon.id}
            </div>
            <div className="WagonPanel__time-events">{timeline.parsedEvents.map(renderEvent)}</div>
        </div>
    );
};

export {WagonPanel};
