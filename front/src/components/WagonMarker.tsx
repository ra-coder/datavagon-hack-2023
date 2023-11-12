import {Ymaps, withMap} from '../hooks/withMap';
import {getLngLat} from '../utils';
import {TimeEventWagon, Wagon} from '../interface';
import {WagonSvg} from './WagonSvg';

import './WagonMarker.css';

type WagonMarkerProps = Ymaps & {
    wagon: Wagon;
    event: TimeEventWagon;
    order?: number;
    active?: boolean;
};

export const WagonMarker = withMap(function ({wagon, event, order, active, ymaps}: WagonMarkerProps) {
    let className = 'WagonMarker';
    if (active) {
        className += ' WagonMarker_active';
    }

    return (
        <ymaps.YMapMarker coordinates={getLngLat(event)} properties={{hint: {type: 'wagon', ...wagon, ...event}}}>
            <div className={className}>
                <WagonSvg />
                <span>{order}</span>
            </div>
        </ymaps.YMapMarker>
    );
});
