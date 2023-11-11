import React from 'react';
import {useWatchHistory} from '../utils'
import {MainView} from './MainView';
import {TrainView} from './TrainView';
import {SetMapLocation} from '../interface';
import { INITIAL_MOMENT } from '../withMoment';

interface PathViewProps {
    setLocation: SetMapLocation;
}

export function PathView({setLocation}: PathViewProps) {
    const params = useWatchHistory();

    switch(params.type) {
        case 'main':
           return <MainView />;
        case 'train':
            return <TrainView id={params.id!} moment={params.moment || INITIAL_MOMENT} setLocation={setLocation}/>;
        default:
            return null;
    }
}
