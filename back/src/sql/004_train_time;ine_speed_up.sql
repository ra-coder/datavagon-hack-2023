       explain analyse    with train_locations as (
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
                        --api/v1/trains?on_timestamp=1689467400&window_secs=1800
                            to_timestamp(1689467400 ::int - 1800 ::int)
                            and to_timestamp(1689467400 ::int)
                    and train_index notnull
                    and dislocation_station_id notnull
                group by train_index, moment, dislocation_station_id, station.id
                order by train_index desc, moment desc
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