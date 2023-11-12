import os

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from .schemas import TimestampFilter, TrainInfoOnTime, TrainRouteInfo, TrainsInfoOnTime

train_api_router = APIRouter()


@train_api_router.get("/api/v1/train/{train_index}/timeline", response_model=TrainRouteInfo)
async def get_table_calendar(
    train_index: str,
    on_timestamp: int | None = Query(alias='on_timestamp', default=None),
    window_secs: int = Query(alias='window_secs', default=24*30*60*60),
    # session: AsyncSession = Depends(get_session),
) -> TrainRouteInfo:
    query = text("""
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
        where 
            vagon_location_stream.train_index= :train_index
                AND
            (:on_timestamp :: int isnull  OR vagon_location_stream.moment between (
            to_timestamp(:on_timestamp :: int - :window_secs :: int ) )  and  to_timestamp(:on_timestamp :: int))
        group by vagon_location_stream.train_index, moment,
                 dislocation_station_id, latitude, longitude, station.name,
                 train.name
        order by
                train_index desc, moment desc 
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
        where longitude notnull
        group by train_index, train_name;    
    """)

    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
            params={
                "train_index": train_index,
                "on_timestamp": on_timestamp,
                "window_secs": window_secs,
            },
        )
        data = result.fetchone()
        if data is None:
            raise HTTPException(status_code=404, detail='no such train')

    return TrainRouteInfo.parse_obj(data.train_timeline)


@train_api_router.get("/api/v1/trains", response_model=TrainsInfoOnTime)
async def get_table_calendar(
    on_timestamp: int = Query(alias='on_timestamp'),
    window_secs: int = Query(alias='window_secs', default=900),  # 900 <-> 15 min
    # session: AsyncSession = Depends(get_session),
) -> TrainsInfoOnTime:
    query = text(
        """            
            with train_locations as (
                select
                    train_index,
                    extract(epoch from moment)::int as moment,
                    dislocation_station_id,
                    jsonb_agg(distinct vagon_id) as vagon_ids
                from
                    vagon_location_stream
                where
                    moment between 
                            to_timestamp(:on_timestamp ::int - :window_secs ::int)  
                            and to_timestamp(:on_timestamp ::int)
                    and train_index notnull
                    and dislocation_station_id notnull
                group by train_index, moment, dislocation_station_id
                order by train_index desc, moment desc
            )
            select
                jsonb_build_object(
                    'train_index', train_index,
                    'last_moment', max(moment),
                    'events', jsonb_agg(
                         jsonb_build_object(
                            'moment', moment,
                            'dislocation', jsonb_build_object(
                                'id', dislocation_station_id,
                                'name', station.name,
                                'latitude', latitude,
                                'longitude', longitude
                            ),
                            'vagon_ids', vagon_ids
                        )
                    )
                )
                as train
            from train_locations
                join
            station on dislocation_station_id = station.id
            group by train_index;                    
        """
    )


    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
            params={
                "window_secs": window_secs,
                "on_timestamp": on_timestamp,
            },
        )
        trains = [TrainInfoOnTime.parse_obj(rec.train) for rec in result.all()]

    return TrainsInfoOnTime(
        trains=trains,
        filters=TimestampFilter(
            on_timestamp=on_timestamp,
            window_secs=window_secs,
        ),
    )
