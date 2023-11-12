import {Dislocation} from '../interface';
import {getLngLat} from '../utils';
import {Ymaps, withMap} from '../hooks/withMap';

import './StationMarker.css';

type StationMarkerProps = Ymaps & {
    dislocation: Dislocation;
};

export const StationMarker = withMap(function ({dislocation, ymaps}: StationMarkerProps) {
    return (
        <ymaps.YMapMarker coordinates={getLngLat(dislocation)}>
            <div className="StationMarker" />
        </ymaps.YMapMarker>
    );
});
