import React from 'react';
import {Ymaps, withMap} from '../hooks/withMap';
import {getLngLat} from '../utils';
import {TimeEventTrain} from '../interface';
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
    let className = 'TrainMarker';
    if (active) {
        className += ' TrainMarker_active';
    }
    if (onClick) {
        className += ' TrainMarker_interactive';
    }


    return (
        <ymaps.YMapMarker
            coordinates={getLngLat(event)}
            properties={{hint: {type: 'train', ...train, ...event}}}
            onClick={onClick}
            zIndex={10000}
        >
            <div className={className}>
                <TrainSvg />
                <span>{order}</span>
            </div>
        </ymaps.YMapMarker>
    );
});
