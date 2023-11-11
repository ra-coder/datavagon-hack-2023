import React from 'react';

/* 2023-06-01 00:00:00.000000 */
const MIN_MOMENT = 1685566800000;
/* 2023-09-01 00:00:00.000000 */
const MAX_MOMENT = 1693515600000;

const INITIAL_MOMENT = 1689467400000;
const TIME_WINDOW = 1800;

const useMoment = (initialMoment: number): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [moment, setMoment] = React.useState<number>(initialMoment);

    return [moment, setMoment];
}

export {
    useMoment,
    MIN_MOMENT,
    MAX_MOMENT,
    INITIAL_MOMENT,
    TIME_WINDOW
};
