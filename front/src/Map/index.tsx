import React from "react";
import {YMapLocationRequest} from "@yandex/ymaps3-types";
import {withMap, Ymaps} from '../withMap';
import {BaseLayers} from "./BaseLayers";
import {PathView} from "./PathView";
import {TrainHint} from "../TrainHint";

const INITIAL_LOCATION: YMapLocationRequest = {center: [37.623082, 55.75254], zoom: 9};

export const Map = withMap(function ({ymaps}: Ymaps) {
    const projection = React.useRef(new ymaps.SphericalMercator());
    const [location, setLocation] = React.useState<YMapLocationRequest>(INITIAL_LOCATION);

    return <React.Fragment>
        <ymaps.YMap location={location} projection={projection.current} >
            <BaseLayers />
            <PathView setLocation={setLocation}/>
            <ymaps.YMapHint hint={object => object?.properties?.hint}>
                <TrainHint />
            </ymaps.YMapHint>
        </ymaps.YMap>
    </React.Fragment>
})
