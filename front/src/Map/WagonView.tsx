import React from 'react';
import {Ymaps, withMap} from '../withMap';
import type {
    Dislocation,
    SetMapLocation,
    TimeEventWagon,
    WagonEventsParsed,
    WagonTimeline
} from '../interface';
import { getWagonInfo } from '../requests';
import { WagonPanel } from '../WagonPanel';
import { Loading } from '../Loading';

type WagonProps = Ymaps & {
    id: string;
    moment: number;
    setLocation: SetMapLocation;
}


interface WagonInfoTimeline extends WagonTimeline {
    timeline: WagonEventsParsed[];
}

const parseWagonEvents = (wagonEvents: TimeEventWagon[]): WagonEventsParsed[] => {
    const res: WagonEventsParsed[] = [];

    let endMoment: number;
    let endDislocaion: Dislocation;
    for (let i = wagonEvents.length - 1; i >= 0; i--) {
        const curEvent = wagonEvents[i];
        if (i === wagonEvents.length - 1) {
            endMoment = curEvent.moment;
            endDislocaion = curEvent.dislocation;
            continue;
        }
        const prevEvent = wagonEvents[i + 1];

        if (curEvent.train.train_index !== prevEvent.train.train_index) {
            res.push({
                train: prevEvent.train,
                route: {
                    start: prevEvent.dislocation,
                    end: endDislocaion!,
                },
                duration: endMoment! - prevEvent.moment,
                moment: {
                    start: prevEvent.moment,
                    end: endMoment!,
                }
            });
            endMoment = curEvent.moment;
            endDislocaion = curEvent.dislocation;
            continue;
        }

        /* Можно аккамулировать информацию по одному поезду в этом месте */
    }

    return res;
}

export const WagonView = withMap(function({id, moment, setLocation, ymaps}: WagonProps) {
    const [wagonInfo, setWagonInfo] = React.useState<WagonInfoTimeline>();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        getWagonInfo(id/* , moment */).then((data) => {
            const wagonInfoTimeline = {
                ...data,
                timeline: parseWagonEvents(data.events)
            };
            setWagonInfo(wagonInfoTimeline);

            // const bounds = nextTimeline.events.reduce<LngLatBounds>((memo, event) => {
            //     memo[0][0] = Math.min(memo[0][0], event.dislocation.longitude);
            //     memo[0][1] = Math.min(memo[0][1], event.dislocation.latitude);
            //     memo[1][0] = Math.max(memo[1][0], event.dislocation.longitude);
            //     memo[1][1] = Math.max(memo[1][1], event.dislocation.latitude);

            //     return memo;
            // }, [[Infinity, Infinity], [-Infinity, -Infinity]] as LngLatBounds);

            // setLocation({bounds});
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        })
    }, [id, setLocation]);

    if (loading) return <Loading loading={loading} />
    if (!wagonInfo) return null;

    return (
        <>
            {/* {timeline.events.map((event, index) => (
                <TrainMarker
                    key={index}
                    event={event}
                    train={timeline.train}
                    order={index + 1}
                />
            ))}
            <ymaps.YMapFeature
                geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}}
                style={{stroke: [{width: 5, color: '#aaffaa'}]}}
            /> */}
            <WagonPanel id={id} timeline={wagonInfo.timeline} wagon={wagonInfo.vagon} />
        </>
    );
});
