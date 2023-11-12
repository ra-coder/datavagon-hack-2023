import React from 'react';
import {Ymaps, withMap} from '../withMap';
import {compactTrainTimeLineEvents, getLngLat} from '../utils';
import {SetMapLocation, TrainTimeline} from '../interface';
import {TrainPanel} from '../TrainPanel';
import {getTrainTimeLine} from '../requests';
import {LngLatBounds} from '@yandex/ymaps3-types';
import {TrainMarker} from '../TrainMarker';
import { Loading } from '../Loading';

type TrainProps = Ymaps & {
    id: string;
    moment: number;
    wagonId?: number;
    setLocation: SetMapLocation;
}

export const TrainView = withMap(function({id, moment, wagonId, setLocation, ymaps}: TrainProps) {
    const [timeline, setTimeline] = React.useState<TrainTimeline>();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        getTrainTimeLine(id, moment, wagonId).then((data) => {
            const detail = (data as unknown as { detail: string }).detail
            if (detail) {
                alert(detail);
                setLoading(false);
                return;
            }
            const nextTimeline = {
                ...data,
                events: compactTrainTimeLineEvents(data, wagonId)
            };
            setTimeline(nextTimeline);

            const bounds = nextTimeline.events.reduce<LngLatBounds>((memo, event) => {
                memo[0][0] = Math.min(memo[0][0], event.dislocation.longitude);
                memo[0][1] = Math.min(memo[0][1], event.dislocation.latitude);
                memo[1][0] = Math.max(memo[1][0], event.dislocation.longitude);
                memo[1][1] = Math.max(memo[1][1], event.dislocation.latitude);

                return memo;
            }, [[Infinity, Infinity], [-Infinity, -Infinity]] as LngLatBounds);

            setLocation({bounds});
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        })
    }, [id, setLocation, moment, wagonId]);

    if (loading) return <Loading loading={loading} />
    if (!timeline) return null;

    return (
        <>
            {timeline.events.map((event, index) => (
                <TrainMarker
                    key={index}
                    event={event}
                    train={timeline.train}
                    order={index + 1}
                    active={index === timeline.events.length - 1}
                />
            ))}
            <ymaps.YMapFeature
                geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}}
                style={{stroke: [{width: 5, color: '#aaaaff'}]}}
            />
            <TrainPanel id={id} timeline={timeline} />
        </>
    );
});
