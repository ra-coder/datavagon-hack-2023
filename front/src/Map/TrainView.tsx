import React from 'react';
import {Ymaps, withMap} from '../hooks/withMap';
import {compactTrainTimeLineEvents, getLngLat} from '../utils';
import {IdealPath, SetMapLocation, TrainTimeline} from '../interface';
import {TrainPanel} from '../components/TrainPanel';
import {getIdealPath, getTrainTimeLine} from '../requests';
import {LngLatBounds} from '@yandex/ymaps3-types';
import {TrainMarker} from '../components/TrainMarker';
import {Loading} from '../components/Loading';
import {StationMarker} from '../components/StationMarker';

type TrainProps = Ymaps & {
    id: string;
    moment: number;
    wagonId?: number;
    setLocation: SetMapLocation;
};

export const TrainView = withMap(function ({id, moment, wagonId, setLocation, ymaps}: TrainProps) {
    const [timeline, setTimeline] = React.useState<TrainTimeline>();
    const [loading, setLoading] = React.useState(false);
    const [idelPath, setIdealPath] = React.useState<IdealPath>({path: []});

    React.useEffect(() => {
        setLoading(true);
        Promise.all([
            getTrainTimeLine(id, moment, wagonId).then((data) => {
                const detail = (data as unknown as {detail: string}).detail;
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
            }),
            getIdealPath(id).then((data) => {
                setIdealPath(data);

                const bounds = data.path.reduce<LngLatBounds>(
                    (memo, p) => {
                        memo[0][0] = Math.min(memo[0][0], p.longitude);
                        memo[0][1] = Math.min(memo[0][1], p.latitude);
                        memo[1][0] = Math.max(memo[1][0], p.longitude);
                        memo[1][1] = Math.max(memo[1][1], p.latitude);

                        return memo;
                    },
                    [
                        [Infinity, Infinity],
                        [-Infinity, -Infinity]
                    ] as LngLatBounds
                );

                setLocation({bounds});
            })
        ])
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, setLocation, moment, wagonId]);

    if (loading) return <Loading loading={loading} />;
    if (!timeline) return null;

    return (
        <>
            {timeline.events.map((event, index) => (
                <TrainMarker
                    key={index}
                    event={event}
                    train={timeline.train}
                    order={timeline.events.length - index}
                    active={index === 0}
                />
            ))}
            <ymaps.YMapFeature
                geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}}
                style={{stroke: [{width: 5, color: '#aaaaff'}]}}
            />

            {idelPath.path.map((p, index) => (
                <StationMarker key={index} dislocation={p} />
            ))}
            <ymaps.YMapFeature
                geometry={{type: 'LineString', coordinates: idelPath.path.map(getLngLat)}}
                style={{stroke: [{width: 5, color: '#aaffaa'}]}}
            />
            <TrainPanel id={id} timeline={timeline} />
        </>
    );
});
