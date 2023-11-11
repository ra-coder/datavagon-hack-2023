import React from 'react';
import {Ymaps, withMap} from './withMap';
import {BehaviorMapEventHandler, LngLat, LngLatBounds} from '@yandex/ymaps3-types';

type StationsProps = Ymaps & {
    initialBounds: LngLatBounds;
}

function isInBounds(point: LngLat, bounds: LngLatBounds) {
    const [x, y] = point;
    const [x1, y1] = bounds[0];
    const [x2, y2] = bounds[1];
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

function IntStations({initialBounds, ymaps}: StationsProps) {
    const [bounds, setBounds] = React.useState(initialBounds);
    const onActionEnd = React.useCallback<BehaviorMapEventHandler>(({location}) => setBounds(location.bounds), []);
    const stations: LngLat[] = [];

    return (
        <>
            {
                stations
                    .filter((p) => isInBounds(p, bounds))
                    .map((point, index) => (
                        <ymaps.YMapMarker key={index} coordinates={point}>
                            <div style={{width: 16, height: 16, background: '#121212', transform: 'translate(-50%, -50%)'}} />
                        </ymaps.YMapMarker>
                    ))
            }
            <ymaps.YMapListener onActionEnd={onActionEnd} />
        </>
    );
}

export const Stations = withMap(IntStations);
