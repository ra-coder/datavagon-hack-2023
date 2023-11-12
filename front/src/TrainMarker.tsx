import React from 'react';
import {Ymaps, withMap} from './withMap';
import {getLngLat} from './utils';
import {TimeEventTrain} from './interface';
import {TrainSvg} from './TrainSvg';

import './TrainMarker.css';

type TrainMarkerProps = Ymaps & {
    train: {
        name?: string;
        train_index: string;
    }
    event: TimeEventTrain;
    order?: number;
    onClick?: () => void;
    active?: boolean;
}

export const TrainMarker = withMap(function({train, event, order, onClick, active, ymaps}: TrainMarkerProps) {
    const className = [
        'TrainMarker',
        active && 'TrainMarker_active',
        onClick && 'TrainMarker_interactive'
    ].filter(Boolean).join(' ');

    return (
        <ymaps.YMapMarker
            coordinates={getLngLat(event)}
            properties={{hint: {type: 'train', ...train, ...event}}}
            onClick={onClick}
        >
            <div className={className}>
                <TrainSvg />
                {order}
            </div>
        </ymaps.YMapMarker>
    );
});
