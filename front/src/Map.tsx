import React from "react";
import {LngLatBounds, YMapLocationRequest} from "@yandex/ymaps3-types";
import {withMap, Ymaps} from './withMap';
// import {Train} from "./Train";
// import {Stations} from "./Stations";
import {TrainList} from './TrainList';
import {TrainHint} from "./TrainHint";
import {INITIAL_MOMENT} from "./withMoment";

const LOCATION: YMapLocationRequest = {center: [37.623082, 55.75254], zoom: 9};
const INITIAL_BOUNDS: LngLatBounds = [[34.881,56.158],[40.374,55.298]];

function IntMap({ymaps}: Ymaps) {
    const projection = React.useRef(new ymaps.SphericalMercator())

    return <React.Fragment>
        <ymaps.YMap location={LOCATION} projection={projection.current} >
            <ymaps.YMapTileDataSource
                id="osm"
                copyrights={['© OpenStreetMap contributors']}
                raster={{
                    type: 'ground',
                    fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png'
                }}
                zoomRange={{min: 0, max: 19}}
                clampMapZoom
            />
            <ymaps.YMapLayer source="osm" type="ground" />
            <ymaps.YMapTileDataSource
                id="railway"
                raster={{
                    type: 'ground',
                    fetchTile: 'https://a.tiles.openrailwaymap.org/standard/{{z}}/{{x}}/{{y}}.png'
                }}
            />
            <ymaps.YMapLayer source="railway" type="ground" />
            <ymaps.YMapDefaultFeaturesLayer />
            {/* <Stations initialBounds={INITIAL_BOUNDS} /> */}
            <TrainList initialMoment={INITIAL_MOMENT} timeWindow={1800}/>
            <ymaps.YMapHint hint={object => object?.properties?.hint}>
                <TrainHint />
            </ymaps.YMapHint>
            <ymaps.YMapControls position="right">
                <ymaps.YMapZoomControl />
            </ymaps.YMapControls>
        </ymaps.YMap>
    </React.Fragment>
}

export const Map = withMap(IntMap)
