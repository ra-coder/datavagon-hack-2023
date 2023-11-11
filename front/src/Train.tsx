import React from 'react';
import {Ymaps, withMap} from './withMap';
import {backendUrl, getLngLat} from './utils';
import {TrainEvent} from './interface';

type TrainProps = Ymaps & {
    id: string;
}

interface Timeline {
    train: {
        name: string;
        train_index: string;
    }
    events: TrainEvent[]
}

function IntTrain({id, ymaps}: TrainProps) {
    const [timeline, setTimeline] = React.useState<Timeline>();

    React.useEffect(() => {
        const url = `${backendUrl}/train/${id}/timeline`;
        fetch(url).then((data) => data.json()).then((data) => {
            setTimeline(data);
        })
    }, [id]);

    if (!timeline) return null;

    return (
        <>
            {timeline.events.map((event, index) => (
                <ymaps.YMapMarker key={index} coordinates={getLngLat(event)} properties={{hint: event}}>
                    <div style={{width: 16, height: 16, background: '#7036BD', transform: 'translate(-50%, -50%)'}} />
                </ymaps.YMapMarker>
            ))}
            <ymaps.YMapFeature geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}} />
        </>
    );
}

export const Train = withMap(IntTrain);
