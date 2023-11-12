import React from 'react';
import {stringifyDate} from '../utils';
import {pushHistory} from '../hooks/useHistory';
import type {TimeEventTrain, TrainTimeline} from '../interface';

import './TrainPanel.css';

interface TrainPanelProps {
    id: string;
    timeline: TrainTimeline;
}

export const TrainPanel: React.FC<TrainPanelProps> = ({id, timeline}) => {
    if (!id || !timeline) {
        return null;
    }

    const train = timeline.train;
    const [train_from, train_id, trin_to] = train.train_index.split('-');

    const renderRow = (title: string, val: string) => {
        return (
            <div className="TrainPanel__row">
                {title}: <span>{val}</span>
            </div>
        );
    };

    const renderList = (title: string, list: (string | number)[]) => {
        return (
            <div className="TrainPanel__row">
                {title}:
                <ul>
                    {list.map((val, i) => {
                        const searchParams = new URLSearchParams(window.location.search);
                        const wagonId = Number(searchParams.get('wagonId')) || undefined;
                        const className = val === wagonId ? 'TrainPanel__hightlight Link' : 'Link';

                        return (
                            <li key={i}>
                                <a onClick={() => pushHistory(`wagon/${val}`)} className={className}>
                                    {val}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const renderEvent = (timeEvent: TimeEventTrain) => {
        const [date, time] = stringifyDate(new Date(timeEvent.moment * 1000));
        return (
            <div key={timeEvent.dislocation.id} className="TrainPanel__time-event">
                <div className="TrainPanel__time-event-time">
                    {/* Время появления */}
                    <span>{date}</span>
                    <span>{time}</span>
                </div>
                <div className="TrainPanel__time-event-meta">
                    {renderRow('Станция', `${timeEvent.dislocation.name} ${String(timeEvent.dislocation.id)}`)}
                    {renderList('Вагоны', timeEvent.vagon_ids)}
                </div>
            </div>
        );
    };

    return (
        <div className="TrainPanel">
            <div className="TrainPanel__title">
                {train.name} {train.train_index}
            </div>

            {renderRow('Номер поезда', train_id)}
            {renderRow('Маршрут', `${train_from} - ${trin_to}`)}

            <div className="TrainPanel__title-history">История</div>
            <div className="TrainPanel__time-events">{timeline.events.map(renderEvent)}</div>
        </div>
    );
};
