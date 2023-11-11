import React from 'react';
import {Ymaps, withMap} from './withMap';
import {BehaviorMapEventHandler, LngLatBounds} from '@yandex/ymaps3-types';
import {backendUrl} from './utils';

type StationsProps = Ymaps & {
    initialBounds: LngLatBounds;
}

function isInBounds(station: Station, bounds: LngLatBounds) {
    const [x, y] = [station.longitude, station.latitude];
    const [x1, y1] = bounds[0];
    const [x2, y2] = bounds[1];

    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

type Station = {
    id: number;
    name: string;
    latitude: number;
    longitude: number
}

function IntStations({initialBounds, ymaps}: StationsProps) {
    const [bounds, setBounds] = React.useState(initialBounds);
    const onActionEnd = React.useCallback<BehaviorMapEventHandler>(({location}) => {
        setBounds(location.bounds)
    }, []);
    const [stations, setStations] = React.useState<Station[]>();

    React.useEffect(() => {
        const url = `${backendUrl}/stations`;
        fetch(url).then((data) => data.json()).then((data) => {
            setStations(data.stations);
        })
    }, []);

    if (!stations) return null;

    return (
        <>
            {
                stations
                    .filter((s) => isInBounds(s, bounds))
                    .map((s) => (
                        <ymaps.YMapMarker key={s.id} id={s.id.toString()} coordinates={[s.longitude, s.latitude]}>
                            <div style={{width: 10, height: 16, background: '#ccc', transform: 'translate(-50%, -50%)'}} />
                        </ymaps.YMapMarker>
                    ))
            }
            <ymaps.YMapListener onActionEnd={onActionEnd} />
        </>
    );
}

export const Stations = withMap(IntStations);
