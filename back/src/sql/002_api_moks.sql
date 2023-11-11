explain analyse
with train_locations as (
    select
        train_index,
        moment,
        jsonb_build_object(
            'moment', moment,
            'dislocation_station_id', dislocation_station_id,
            'vagon_ids', jsonb_agg(distinct vagon_id)
        ) as location_info
    from
        vagon_location_stream
    where
        moment between to_timestamp(1693130340 - 900)  and to_timestamp(1693130340)
        and train_index notnull
    group by train_index, moment, dislocation_station_id
    order by train_index, moment desc
)
select
    jsonb_build_object(
        'train_index', train_index,
        'last_moment', max(moment),
        'last_locations', jsonb_agg(
            location_info
        )
    )
    as train
from train_locations
group by train_index
;


--create index concurrently on vagon_location_stream (moment, train_index, vagon_id);