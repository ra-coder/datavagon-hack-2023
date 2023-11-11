import React from 'react';
import throttle from 'lodash.throttle'

import './Timeline.css';
import { MAX_MOMENT, MIN_MOMENT, useMoment } from './withMoment';

const DELAY = 300;
const STEP = 10 * 60 * 1000;

interface TimelineProps {
    initialMoment: number;
    onUpdate: (moment: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({initialMoment, onUpdate}) => {
    const [moment, setMoment] = useMoment(initialMoment);

    const onChane: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const nextMoment = Number(e.target.value);
        setMoment(nextMoment);
        onUpdate(nextMoment);
    }
    const onChangeThrottled = throttle(onChane, DELAY)

    const currentMoment = new Date(moment);
    const date = currentMoment.getFullYear() + "-" +
        (currentMoment.getMonth() + 1).toString().padStart(2, '0') + "-" +
        currentMoment.getDate().toString().padStart(2, '0');

    const time = currentMoment.getHours().toString().padStart(2, '0') + ":" +
        currentMoment.getMinutes().toString().padStart(2, '0') + ":" +
        currentMoment.getSeconds().toString().padStart(2, '0');

    return (
        <div className='Timeline'>
            <input
                className='Timeline__input'
                type="range"
                min={MIN_MOMENT}
                max={MAX_MOMENT}
                step={STEP}
                onChange={onChangeThrottled}
                value={moment}
            />
            <div className='Timeline__date'>
                <span>{date}</span>
                <span>{time}</span>
            </div>
        </div>
    )
}

export { Timeline };
