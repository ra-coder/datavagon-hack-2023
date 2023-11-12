import React from 'react';
import {Ymaps, withMap} from '../withMap';
import {getLngLat} from '../utils';
import {Dislocation, SetMapLocation, TimeEventWagon, WagonEventsParsed, WagonTimeline, WagonTimelineParsed} from '../interface';
import {WagonPanel} from '../WagonPanel';
import {getWagonTimeLine} from '../requests';
import {LngLatBounds} from '@yandex/ymaps3-types';
import { WagonMarker } from '../WagonMarker';

type WagonViewProps = Ymaps & {
    id: string;
    moment: number;
    setLocation: SetMapLocation;
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

export const WagonView = withMap(function({id, moment, setLocation, ymaps}: WagonViewProps) {
    const [timeline, setTimeline] = React.useState<WagonTimelineParsed>();

    React.useEffect(() => {
        getWagonTimeLine(id, moment).then((data) => {
            const nextTimeline = {
                ...data,
                parsedEvents: parseWagonEvents(data.events)
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
        })
    }, [id, setLocation, moment]);

    if (!timeline) return null;

    return (
        <>
            {timeline.events.map((event, index) => (
                <WagonMarker
                    key={index}
                    event={event}
                    wagon={timeline.vagon}
                    order={index + 1}
                />
            ))}
            <ymaps.YMapFeature
                geometry={{type: 'LineString', coordinates: timeline.events.map(getLngLat)}}
                style={{stroke: [{width: 5, color: '#aafafa'}]}}
            />
            <WagonPanel id={id} timeline={timeline} wagon={timeline.vagon} />
        </>
    );
});
