import React from 'react';
import {TrainMarker} from '../components/TrainMarker';
import {TimeEventTrain} from '../interface';
import {Timeline} from '../components/Timeline';
import {getTrainsList} from '../requests';
import {pushHistory} from '../hooks/useHistory';
import {INITIAL_MOMENT, TIME_WINDOW} from '../hooks/useMoment';
import { Loading } from '../components/Loading';

interface Train {
    events: TimeEventTrain[];
    last_moment: string;
    train_index: string;
}

export function MainView() {
    const [trains, setTrains] = React.useState<Train[]>();
    const [moment, setMoment] = React.useState<number>(INITIAL_MOMENT);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        pushHistory('', {moment});
        getTrainsList(moment, TIME_WINDOW).then((data) => {
            setTrains(data.trains);
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        })
    }, [moment]);

    const onTimelineUpdate = React.useCallback((moment: number) => {
        setMoment(moment);
    }, []);

    if (!trains) return null;

    return (
        <>
            <Loading loading={loading} />
            {trains.map((train, index) => (
                <TrainMarker
                    key={index}
                    event={train.events[0]}
                    train={train}
                    onClick={() => {
                        pushHistory(`train/${train.train_index}`);
                    }}
                />
            ))}
            <Timeline initialMoment={INITIAL_MOMENT} onUpdate={onTimelineUpdate} />
        </>
    );
}
