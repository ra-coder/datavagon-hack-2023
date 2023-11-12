import {Ymaps, withMap} from "../withMap";

export const BaseLayers = withMap(function({ymaps}: Ymaps) {
    return (
        <>
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
            <ymaps.YMapLayer source="osm" type="ground" zIndex={1000} />
            <ymaps.YMapTileDataSource
                id="railway"
                raster={{
                    type: 'ground',
                    fetchTile: 'https://a.tiles.openrailwaymap.org/standard/{{z}}/{{x}}/{{y}}.png'
                }}
            />
            <ymaps.YMapLayer source="railway" type="ground" zIndex={1100} />
            <ymaps.YMapTileDataSource
                id="shadow"
                raster={{
                    type: 'ground',
                    fetchTile: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mMUmcmAARiHsiAABU0GzXs/qVUAAAAASUVORK5CYII='
                }}
            />
            <ymaps.YMapLayer
                source="shadow"
                type="ground"
                options={{raster:{awaitAllTilesOnFirstDisplay: true}}}
                zIndex={1200}
            />
            <ymaps.YMapDefaultFeaturesLayer zIndex={1300} />
            <ymaps.YMapControls position="right">
                <ymaps.YMapZoomControl />
            </ymaps.YMapControls>
        </>
    );
})
