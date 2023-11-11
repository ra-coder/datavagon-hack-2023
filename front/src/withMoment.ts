import React from 'react';

/* 2023-06-01 00:00:00.000000 */
const MIN_MOMENT = 1685566800000;
/* 2023-09-01 00:00:00.000000 */
const MAX_MOMENT = 1693515600000;

const INITIAL_MOMENT = 1685566800000;

const useMoment = (): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [moment, setMoment] = React.useState<number>(INITIAL_MOMENT);

    return [moment, setMoment];
}

export {
    useMoment,
    MIN_MOMENT,
    MAX_MOMENT,
};
