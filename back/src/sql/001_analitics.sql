select *
from datavagon.public.vagon_location_stream where vagon_id =1738
order by vagon_id, moment;

with train_timeline as (
select
    vagon_location_stream.train_index,
    moment,
    dislocation_station_id,
    station.latitude,
    station.longitude,
    station.name as station_name,
    array_agg(vagon_id) as vagon_ids,
    train.name as train_name
from datavagon.public.vagon_location_stream
join station on vagon_location_stream.dislocation_station_id = station.id
join train on train.train_index = vagon_location_stream.train_index
where vagon_location_stream.train_index='5124-071-6999'
group by vagon_location_stream.train_index, moment,
         dislocation_station_id, latitude, longitude, station.name,
         train.name
order by
        train_index, moment
)
select
    jsonb_build_object(
    'train', jsonb_build_object(
            'train_index', train_index,
            'name', train_name
    ),
    'events', jsonb_agg(
        jsonb_build_object(
                'moment', extract(epoch from moment)::int,
                'moment_as_time_debug', moment,
                'vagon_ids', vagon_ids,
                'dislocation', jsonb_build_object(
                    'id', dislocation_station_id,
                    'name', station_name,
                    'latitude', latitude,
                    'longitude', longitude
                )
            )
    )
        ) as train_timeline
from train_timeline
group by train_index, train_name
;

-- train_index,moment,dislocation_station_id,array_agg
-- 585-374-1138,2023-07-16 22:19:00.000000,585,"{6175,2944}"
-- 585-374-1138,2023-07-16 22:37:00.000000,585,"{2944,6175}"
-- 585-374-1138,2023-07-16 22:40:00.000000,585,"{2944,6175}"
-- 585-374-1138,2023-07-16 23:05:00.000000,585,"{6175,2944}"
-- 585-374-1138,2023-07-16 23:30:00.000000,585,"{6175,2944}"
-- 585-374-1138,2023-07-16 23:35:00.000000,1138,"{6175,2944}"
-- 585-374-1138,2023-07-16 23:38:00.000000,1138,"{2944,6175}"
-- 585-374-1138,2023-07-17 00:35:00.000000,1138,"{2944,6175}"
-- 585-374-1138,2023-07-17 11:29:00.000000,1138,"{6175,2944}"
-- 585-374-1138,2023-07-17 11:30:00.000000,1138,"{2944,6175}"



select * from peregon
         where
    (from_station_id=7000 or to_station_id=6999)
        or
    (to_station_id=7000 or from_station_id=6999)

