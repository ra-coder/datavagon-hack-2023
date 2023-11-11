import React from 'react';
import {Ymaps, withMap} from './withMap';
import { LngLat } from '@yandex/ymaps3-types';

type TrainProps = Ymaps & {
    id: string;
}

interface Event {
    moment: number
    vagon_ids: number[];
    dislocation: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    },
}

interface Timeline {
    train: {
        name: string;
        train_index: string;
    }
    events: Event[]
}

function getLngLat(event: Event): LngLat {
    return [event.dislocation.longitude, event.dislocation.latitude];
}

function IntTrain({id, ymaps}: TrainProps) {
    const [timeline, setTimeline] = React.useState<Timeline>();

    React.useEffect(() => {
        const url = `http://158.160.78.28:8000/api/v1/train/${id}/timeline`;
        fetch(url).then((data) => data.json()).then((data) => {
            console.log(data);
            setTimeline(data);
        })
    }, []);

    if (!timeline) return;

    return (
        <>
            {timeline.events.map((event, index) => (
                <ymaps.YMapMarker key={index} coordinates={getLngLat(event)} properties={{hint: new Date(event.moment * 1000).toString()}}>
                    <div style={{width: 16, height: 16, background: '#7036BD', transform: 'translate(-50%, -50%)'}} />
                </ymaps.YMapMarker>
            ))}
            <ymaps.YMapFeature geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}} />
            <ymaps.YMapHint hint={object => object?.properties?.hint}>
                <TrainHint />
            </ymaps.YMapHint>
        </>
    );
}

const TrainHint = withMap(function TrainHintInt({ymaps}: Ymaps) {
    const ctx = React.useContext(ymaps.YMapHintContext);
    return <div className="hint">{ctx && ctx.hint}</div>;
})

export const Train = withMap(IntTrain);
