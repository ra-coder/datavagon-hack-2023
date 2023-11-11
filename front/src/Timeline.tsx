import React from 'react';
import throttle from 'lodash.throttle'

import './Timeline.css';
import { MAX_MOMENT, MIN_MOMENT, useMoment } from './withMoment';

const DELAY = 300;
const STEP = 10 * 60 * 1000;

const Timeline: React.FC = () => {
    const [moment, setMoment] = useMoment();

    const onChane: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setMoment(Number(e.target.value));
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
            />
            <div className='Timeline__date'>
                <span>{date}</span>
                <span>{time}</span>
            </div>
        </div>
    )
}

export { Timeline };
