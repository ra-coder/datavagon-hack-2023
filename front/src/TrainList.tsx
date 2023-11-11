import React from 'react';
import {Ymaps, withMap} from './withMap';
import {backendUrl, getLngLat} from './utils';
import {TrainSvg} from './TrainSvg';
import {TrainEvent} from './interface';
import { Timeline } from './Timeline';

type TrainMapProps = Ymaps & {
    initialMoment: number;
    timeWindow?: number;
}

interface Train {
    events: TrainEvent[];
    last_moment: string;
    train_index: string;
}

function IntTrainList({initialMoment, timeWindow, ymaps}: TrainMapProps) {
    const [trains, setTrains] = React.useState<Train[]>();
    const [moment, setMoment] = React.useState<number>(initialMoment);

    React.useEffect(() => {
        const url = `${backendUrl}/trains?on_timestamp=${moment / 1000}&window_secs=${timeWindow}`;
        fetch(url).then((data) => data.json()).then((data) => {
            setTrains(data.trains);
        })
    }, [moment, timeWindow]);

    const onTimelineUpdate = React.useCallback((moment: number) => {
        setMoment(moment)
    }, [])

    if (!trains) return null;

    return (
        <>
            {trains.map((train, index) => (
                <ymaps.YMapMarker key={index} coordinates={getLngLat(train.events[0])} properties={{hint: train.events[0]}}>
                    <div style={{width: 25, height: 25, background: '#cacaca', transform: 'translate(-50%, -50%)'}}>
                        <TrainSvg />
                    </div>
                </ymaps.YMapMarker>
            ))}
          <Timeline initialMoment={initialMoment} onUpdate={onTimelineUpdate}/>
        </>
    );
}

export const TrainList = withMap(IntTrainList);
