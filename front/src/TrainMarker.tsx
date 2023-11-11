import React from 'react';
import {Ymaps, withMap} from './withMap';
import {getLngLat} from './utils';
import {TimeEventTrain} from './interface';
import { TrainSvg } from './TrainSvg';

type TrainMarkerProps = Ymaps & {
    train: {
        name?: string;
        train_index: string;
    }
    event: TimeEventTrain;
    order?: number;
    onClick?: () => void;
}

export const TrainMarker = withMap(function({train, event, order, onClick, ymaps}: TrainMarkerProps) {
    return (
        <ymaps.YMapMarker coordinates={getLngLat(event)} properties={{hint: {...train, ...event}}} onClick={onClick}>
            <div style={{width: 25, height: 25, background: '#cacaca', transform: 'translate(-50%, -50%)'}}>
                <TrainSvg />
                {order}
            </div>
        </ymaps.YMapMarker>
    );
});
