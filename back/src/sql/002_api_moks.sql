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


            with train_locations as (
                select
                    train_index,
                    extract(epoch from moment)::int as moment,
                    jsonb_build_object(
                        'moment', extract(epoch from moment)::int,
                        'dislocation', jsonb_build_object(
                            'id', dislocation_station_id,
                            'name', station.name,
                            'latitude', latitude,
                            'longitude', longitude
                        ),
                        'vagon_ids', jsonb_agg(distinct vagon_id)
                    ) as dislocation
                from
                    vagon_location_stream
                        join
                    station on vagon_location_stream.dislocation_station_id = station.id
                where
                    moment between
                            to_timestamp(1693130340 - 60*60)
                            and to_timestamp(1693130340)
                    and train_index notnull
                    and dislocation_station_id notnull
                group by train_index, moment, dislocation_station_id, station.id
                order by train_index, moment desc
            )
            select
                jsonb_build_object(
                    'train_index', train_index,
                    'last_moment', max(moment),
                    'events', jsonb_agg(
                        dislocation
                    )
                )
                as train
            from train_locations
            group by train_index;

select
    dislocation_station_id,
    train_index,
    moment as arrival_moment
from vagon_location_stream
where
    moment  between
        to_timestamp(1687715400 )
        and to_timestamp(1693130340 + 7*24*60*60)
and dislocation_station_id == to_station_id


select
*,
extract(epoch from moment)::int as moment
--     dislocation_station_id,
--     train_index,
--     min(moment) as arrival
from vagon_location_stream
where
--     moment  between
--         to_timestamp(1693130340 + 7*24*60*60)
-- --         and to_timestamp(1693130340)
--     and
        dislocation_station_id = to_station_id
--group by dislocation_station_id, train_index
;


SELECT
    AGGREGATE_LIST_DISTINCT(WAGNUM) as WAGs,
    TRAIN_INDEX,
    MAX_BY(ST_ID_DISL, OPERDATE) as current_disl,
    max(OPERDATE) as last_dt
from `//home/altay-dev/pavlov/bk/sample`
where
    OPERDATE <= cast('2023-06-23' as Date)
    and ST_ID_DEST != ST_ID_DISL
group by TRAIN_INDEX
order by last_dt;





