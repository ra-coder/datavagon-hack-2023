import React from "react";
import {LngLatBounds, YMapLocationRequest} from "@yandex/ymaps3-types";
import {withMap, Ymaps} from './withMap';
import { Train } from "./Train";
import { Stations } from "./Stations";

const LOCATION: YMapLocationRequest = {center: [37.623082, 55.75254], zoom: 9};
const INITIAL_BOUNDS: LngLatBounds = [[34.881,56.158],[40.374,55.298]];

function IntMap(props: Ymaps) {
    const {
        YMap,
        YMapTileDataSource,
        YMapLayer,
        YMapDefaultFeaturesLayer,
        YMapControls,
        YMapZoomControl,
        SphericalMercator
    } = props.ymaps;
    const projection = React.useRef(new SphericalMercator())

    return <React.Fragment>
        <YMap location={LOCATION} projection={projection.current} >
            <YMapTileDataSource
                id="osm"
                copyrights={['© OpenStreetMap contributors']}
                raster={{
                    type: 'ground',
                    fetchTile: 'https://tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png'
                }}
                zoomRange={{min: 0, max: 19}}
                clampMapZoom
            />
            <YMapLayer source="osm" type="ground" />
            <YMapTileDataSource
                id="railway"
                raster={{
                    type: 'ground',
                    fetchTile: 'https://a.tiles.openrailwaymap.org/standard/{{z}}/{{x}}/{{y}}.png'
                }}
            />
            <YMapLayer source="railway" type="ground" />
            <YMapDefaultFeaturesLayer />
            <Stations initialBounds={INITIAL_BOUNDS} />
            <Train id="6484-047-20701" />
            <YMapControls position="right">
                <YMapZoomControl />
            </YMapControls>
        </YMap>
    </React.Fragment>
}

export const Map = withMap(IntMap)
