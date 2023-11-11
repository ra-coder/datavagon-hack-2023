import React from 'react';

import './TrainPanel.css';
import { getTrainIndexFromPath, stringidyDate } from './utils';
import { getTrainInfo } from './requests';
import type { TimeEventTrain, TrainTimeline } from './type';

/*
train_index
6484-047-20701
7475-330-62
6999-467-7475
7423-131-6999
7475-311-62
6999-427-7475
20713-263-6999
7475-269-62
7475-268-62
6999-392-7475
1043-198-20713
7464-024-6999
6999-132-7464
6479-005-6484
6484-500-6999
6484-500-6522
*/

const TrainPanel: React.FC = () => {
    const [trainInfo, setTrainInfo] = React.useState<TrainTimeline | null>(null);
    const trainIndex = getTrainIndexFromPath();

    React.useEffect(() => {
        if (trainIndex) {
            getTrainInfo(trainIndex).then(d => {
                console.log(d);
                setTrainInfo(d);
            }).catch((e) => {
                setTrainInfo(null);
                console.error(e);
            });
        }
    }, [trainIndex])

    if (!trainIndex || !trainInfo) {
        return null;
    }

    const train = trainInfo.train;
    const [train_from, train_id, trin_to] = train.train_index.split('-');

    const renderRow = (title: string, val: string) => {
        return (
            <div className='TrainPanel__row'>
                {title}: <span>{val}</span>
            </div>
        )
    }

    const renderEvent = (timeEvent: TimeEventTrain) => {
        const [date, time] = stringidyDate(new Date(timeEvent.moment * 1000));
        return (
            <div key={timeEvent.dislocation.id} className='TrainPanel__time-event'>
                <div className='TrainPanel__time-event-time'>
                    {/* Время появления */}
                    <span>{date}</span>
                    <span>{time}</span>
                </div>
                <div className='TrainPanel__time-event-meta'>
                    {renderRow('Станция', `${timeEvent.dislocation.name} ${String(timeEvent.dislocation.id)}`)}
                    {renderRow('Вагоны', timeEvent.vagon_ids.join(','))}
                </div>
            </div>
        )
    }

    const events = trainInfo.events.reduce<TimeEventTrain[]>((acc, currentEvent, index, array) => {
        if (index === array.length - 1) {
            acc.push(currentEvent);
        } else if (index === 0) {
            return acc;
        } else if (currentEvent.dislocation.id !== array[index - 1].dislocation.id) {
            acc.push(array[index - 1]);
        }

        return acc;

    }, [])

    return (
        <div className='TrainPanel'>
            <div className='TrainPanel__title'>
                {train.name} {train.train_index}
            </div>

            {renderRow('Номер поезда', train_id)}
            {renderRow('Маршрут', `${train_from} - ${trin_to}`)}

            <div className='TrainPanel__title-history'>
                История
            </div>
            <div className='TrainPanel__time-events'>
                {events.map(renderEvent)}
            </div>
        </div>
    )
}

export { TrainPanel };
