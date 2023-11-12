import React from 'react';
import {Ymaps, withMap} from '../withMap';
import type {
    Dislocation,
    SetMapLocation,
    TimeEventWagon,
    WagonEventsParsed,
    WagonTimelineParsed
} from '../interface';
import { getWagonTimeLine } from '../requests';
import {LngLatBounds} from '@yandex/ymaps3-types';
import { WagonPanel } from '../WagonPanel';
import { Loading } from '../Loading';
import {getLngLat} from '../utils';
import { WagonMarker } from '../WagonMarker';

type WagonViewProps = Ymaps & {
    id: string;
    moment: number;
    setLocation: SetMapLocation;
}

export function compactTrainTimeLineEvents(mapData: { dislocation: Dislocation }[]): any[] {
    return mapData.reduce<any[]>((acc, currentEvent, index, array) => {
        if (index === array.length - 1) {
            acc.push(currentEvent);
        } else if (index === 0) {
            return acc;
        } else if (currentEvent.dislocation.id !== array[index - 1].dislocation.id) {
            acc.push(array[index - 1]);
        }

        return acc;

    }, [])
}

const parseWagonEvents = (wagonEvents: TimeEventWagon[]): WagonEventsParsed[] => {
    const res: WagonEventsParsed[] = [];

    let endMoment: number;
    let endDislocaion: Dislocation;
    const mapData = [];
    for (let i = wagonEvents.length - 1; i >= 0; i--) {
        const curEvent = wagonEvents[i];
        if (i === wagonEvents.length - 1) {
            endMoment = curEvent.moment;
            endDislocaion = curEvent.dislocation;
            mapData.push({
                dislocation: curEvent.dislocation,
                moment: curEvent.moment,
            })
            continue;
        }
        const prevEvent = wagonEvents[i + 1];

        if (i === 0 || curEvent.train.train_index !== prevEvent.train.train_index) {
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
                },
                mapData: mapData.slice(),
            });
            endMoment = curEvent.moment;
            endDislocaion = curEvent.dislocation;
            mapData.length = 0;
            mapData.push({
                dislocation: curEvent.dislocation,
                moment: curEvent.moment,
            })
            continue;
        }

        /* Можно аккамулировать информацию по одному поезду в этом месте */
        mapData.push({
            dislocation: curEvent.dislocation,
            moment: curEvent.moment,
        })
    }

    res.forEach(r => {
        r.mapData = compactTrainTimeLineEvents(r.mapData)
            /* cuz data */
            .filter(v => Boolean(v.dislocation.latitude));
    })

    return res;
}

export const WagonView = withMap(function({id, moment, setLocation, ymaps}: WagonViewProps) {
    const [timeline, setTimeline] = React.useState<WagonTimelineParsed>();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        getWagonTimeLine(id, moment).then((data) => {
            const nextTimeline = {
                ...data,
                parsedEvents: parseWagonEvents(data.events)
            };
            setTimeline(nextTimeline);

            const bounds: LngLatBounds = [[Infinity, Infinity], [-Infinity, -Infinity]];
            nextTimeline.parsedEvents.forEach((eve, iv) => {
                if (iv > 9) return null;
                eve.mapData.forEach((event) => {
                    bounds[0][0] = Math.min(bounds[0][0], event.dislocation.longitude);
                    bounds[0][1] = Math.min(bounds[0][1], event.dislocation.latitude);
                    bounds[1][0] = Math.max(bounds[1][0], event.dislocation.longitude);
                    bounds[1][1] = Math.max(bounds[1][1], event.dislocation.latitude);
                })
            });

            setLocation({bounds});
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        })
    }, [id, setLocation, moment]);

    if (loading) return <Loading loading={loading} />
    if (!timeline) return null;

    return (
        <>
        {timeline.parsedEvents.map((parsedE, iv) => {
            if (iv > 9) return null;
            return (
                <>
                    {parsedE.mapData.map((event, index) => {
                        return <WagonMarker
                            key={`${iv}-${index}`}
                            event={{...event, train: parsedE.train}}
                            wagon={timeline.vagon}
                            order={index + 1}
                        />
                    })}
                    <ymaps.YMapFeature
                        key={iv}
                        geometry={{type: 'LineString', coordinates: parsedE.mapData.map(getLngLat)}}
                        style={{stroke: [{width: 5, color: '#aafafa'}]}}
                    />
                </>
            )
        })}
            {/* {timeline.events.map((event, index) => (
                <WagonMarker
                    key={index}
                    event={event}
                    wagon={timeline.vagon}
                    order={index + 1}
                />
            ))} */}
            {/* <ymaps.YMapFeature
                geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}}
                style={{stroke: [{width: 5, color: '#aafafa'}]}}
            /> */}
            <WagonPanel id={id} timeline={timeline} wagon={timeline.vagon} />
        </>
    );
});
