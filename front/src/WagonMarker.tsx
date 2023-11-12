import {Ymaps, withMap} from './withMap';
import {getLngLat} from './utils';
import {TimeEventWagon, Wagon} from './interface';
import {WagonSvg} from './WagonSvg';

import './WagonMarker.css';

type WagonMarkerProps = Ymaps & {
    wagon: Wagon;
    event: TimeEventWagon;
    order?: number;
}

export const WagonMarker = withMap(function({wagon, event, order, ymaps}: WagonMarkerProps) {
    return (
        <ymaps.YMapMarker coordinates={getLngLat(event)} properties={{hint: {type: 'wagon', ...wagon, ...event}}}>
            <div className="WagonMarker">
                <WagonSvg />
                {order}
            </div>
        </ymaps.YMapMarker>
    );
});
