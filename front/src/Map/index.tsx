import React from 'react';
import {YMapLocationRequest} from '@yandex/ymaps3-types';
import {withMap, Ymaps} from '../hooks/withMap';
import {BaseLayers} from './BaseLayers';
import {PathView} from './PathView';
import {TrainHint} from '../components/TrainHint';
import {WagonHint} from '../components/WagonHint';

const INITIAL_LOCATION: YMapLocationRequest = {center: [37.623082, 55.75254], zoom: 9};

export const Map = withMap(function ({ymaps}: Ymaps) {
    const projection = React.useRef(new ymaps.SphericalMercator());
    const [location, setLocation] = React.useState<YMapLocationRequest>(INITIAL_LOCATION);

    return (
        <React.Fragment>
            <ymaps.YMap location={location} projection={projection.current} margin={[0, 0, 0, 400]}>
                <BaseLayers />
                <PathView setLocation={setLocation} />
                <ymaps.YMapHint hint={(object) => object?.properties?.hint}>
                    <TrainHint />
                    <WagonHint />
                </ymaps.YMapHint>
            </ymaps.YMap>
        </React.Fragment>
    );
});
